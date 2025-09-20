
import React, { useState, useEffect } from 'react';
import { supabase } from '../../services/supabaseClient';

type Status = 'CONNECTED' | 'CONNECTING' | 'DISCONNECTED';

export const ConnectionStatus: React.FC = () => {
    const [status, setStatus] = useState<Status>('CONNECTING');

    useEffect(() => {
        if (!supabase) {
            setStatus('DISCONNECTED');
            return;
        }

        const channel = supabase.channel('db-changes');

        const handleOpen = () => setStatus('CONNECTED');
        const handleClose = () => setStatus('DISCONNECTED');
        const handleError = () => setStatus('DISCONNECTED');

        channel
            .on('postgres_changes', { event: '*', schema: 'public' }, () => {})
            .subscribe((status, err) => {
                if (status === 'SUBSCRIBED') {
                    handleOpen();
                } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || err) {
                    handleClose();
                }
            });

        // Fallback check for initial connection state
        setTimeout(() => {
             if (channel.state !== 'joined') {
                 setStatus('CONNECTING');
             }
        }, 1000);


        return () => {
            supabase.removeChannel(channel);
        };
    }, []);

    const getStatusInfo = () => {
        switch (status) {
            case 'CONNECTED':
                return { text: 'Połączono', color: 'bg-green-500', icon: '✔' };
            case 'CONNECTING':
                return { text: 'Łączenie...', color: 'bg-yellow-500', icon: '...' };
            case 'DISCONNECTED':
            default:
                return { text: 'Brak połączenia', color: 'bg-red-500', icon: '✖' };
        }
    };

    const { text, color, icon } = getStatusInfo();

    return (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-300 rounded-full shadow-lg text-sm">
            <span className={`w-3 h-3 rounded-full ${color}`}></span>
            <span className="text-slate-600 font-medium">{text}</span>
        </div>
    );
};
