import { useQuery } from '@tanstack/react-query';
import { api } from '../api/api';

const contactComponent = () => {
    return useQuery({
        queryKey: ['smartCardContactDetail'],
        queryFn: async () => {
            const response = await api.get(`/smartcard/contact`, {
                headers: {
                    Authorization: `Bearer aaa`,
                },
            });
            return response.data.contact;
        },
        staleTime: 1000 * 60 * 2, //2 mins
    });
};

export default contactComponent;