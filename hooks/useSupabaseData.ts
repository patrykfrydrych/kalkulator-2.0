import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';

export function useSupabaseData<T>(
    key: string,
    initialValue: T
): [T, (value: T | ((val: T) => T)) => void, boolean] {
    const [data, setData] = useState<T>(initialValue);
    const [isLoading, setIsLoading] = useState<boolean>(true);

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

                if (error && error.code !== 'PGRST116') { // PGRST116 = "searched row not found"
                    throw error;
                }

                if (remoteData) {
                    setData(remoteData.data);
                } else {
                    // No data found, insert initial value
                    await supabase.from('calculator_data').insert({ id: key, data: initialValue });
                    setData(initialValue);
                }
            } catch (error) {
                console.error(`Error fetching Supabase data for key "${key}":`, error);
                setData(initialValue); // Fallback to initial value
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
        
        // FIX: The 'RealtimeChannel' type is not exported from '@supabase/supabase-js'.
        // Refactored to use a 'const' for the channel and let TypeScript infer the type.
        // This resolves the type error and simplifies the code.
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

    }, [key, initialValue]);

    return [data, setDataAndPersist, isLoading];
}
