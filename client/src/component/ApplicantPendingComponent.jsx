import { useQuery } from '@tanstack/react-query';
import { api } from '../api/api';

const ApplicantDetailComponent = (id) => {

    return useQuery({
        queryKey: ['smartCardPendingDetail', id],
        queryFn: async () => {
            const response = await api.get(`/smartcard/pending`, {
                headers: {
                    Authorization: `Bearer aaa`,
                },
            });
            console.log(response.data)
            return response.data.card;
        },
        staleTime: 1000 * 60 * 2,  // 2 minutes
    });
};

export default ApplicantDetailComponent;
