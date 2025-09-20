import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '../services/supabaseClient';

export function useSupabaseData<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void, boolean] {
    const [data, setData] = useState<T>(initialValue);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const initialValueRef = useRef(JSON.stringify(initialValue));

    const updateRemoteData = useCallback(async (newData: T) => {
        if (!supabase) return;
        try {
            const { error } = await supabase
                .from('calculator_data')
                .update({ data: newData, updated_at: new Date().toISOString() })
                .eq('id', key);
            if (error) {
                // If the row doesn't exist, insert it
                if (error.code === 'PGRST116') {
                    const { error: insertError } = await supabase
                        .from('calculator_data')
                        .insert({ id: key, data: newData });
                    if (insertError) throw insertError;
                } else {
                    throw error;
                }
            }
        } catch (error) {
            console.error(`Error updating Supabase data for key "${key}":`, error);
        }
    }, [key]);

    const setDataAndPersist = useCallback((value: T | ((val: T) => T)) => {
        const valueToStore = value instanceof Function ? value(data) : value;
        setData(valueToStore);
        updateRemoteData(valueToStore);
    }, [data, updateRemoteData]);

    useEffect(() => {
        if (!supabase) {
            setIsLoading(false);
            console.warn("Supabase not configured, using initial data.");
            return;
        }

        const fetchData = async () => {
            setIsLoading(true);
            try {
                const { data: remoteData, error } = await supabase
                    .from('calculator_data')
                    .select('data')
                    .eq('id', key)
                    .single();
                
                const parsedInitialValue = JSON.parse(initialValueRef.current);

                if (error && error.code !== 'PGRST116') { // PGRST116 = "searched row not found"
                    throw error;
                }

                if (remoteData) {
                    setData(remoteData.data);
                } else {
                    // No data found, insert initial value
                    await supabase.from('calculator_data').insert({ id: key, data: parsedInitialValue });
                    setData(parsedInitialValue);
                }
            } catch (error) {
                console.error(`Error fetching Supabase data for key "${key}":`, error);
                setData(JSON.parse(initialValueRef.current)); // Fallback to initial value
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        
        const channel = supabase.channel(`calculator_data:${key}`)
            .on('postgres_changes', 
                { event: 'UPDATE', schema: 'public', table: 'calculator_data', filter: `id=eq.${key}` }, 
                (payload) => {
                    if (payload.new && payload.new.data) {
                        setData(payload.new.data as T);
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };

    }, [key]); // Dependency array simplified to only re-run when the key changes.

    return [data, setDataAndPersist, isLoading];
}
