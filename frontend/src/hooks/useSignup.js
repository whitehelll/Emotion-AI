import { useMutation, useQueryClient } from '@tanstack/react-query'
import React from 'react'
import { signup } from '../lib/api';

const useSignup = () => {
    const queryClient = useQueryClient();
    const{mutate , error ,isPending}=useMutation({
        mutationFn:signup,
        onSuccess: () => queryClient.invalidateQueries({queryKey: ["authUser"]}),

    });

    return {error,isPending, signupMutation: mutate};
}

export default useSignup
