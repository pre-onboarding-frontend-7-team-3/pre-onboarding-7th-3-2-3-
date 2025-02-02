import {
  QueryClient,
  useMutation,
  useQueries,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { AxiosError } from "axios";
import { userQueryParamsProps, FormDataType } from "./User.model";
import UserRepository from "./User.repository";

export const useGetUserListQuery = (userQueryParams: userQueryParamsProps) => {
  return useQuery(
    ["GetUserList", userQueryParams],
    () => {
      return UserRepository.getUserList(userQueryParams);
    },
    {
      staleTime: 10 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
      keepPreviousData: true,
    }
  );
};

export const usePrefetchUserListQuery = (
  queryClient: QueryClient,
  userQueryParams: userQueryParamsProps
) => {
  const userPrefetchQueryParams = {
    ...userQueryParams,
    pageNum: userQueryParams.pageNum + 1,
  };
  queryClient.prefetchQuery(
    ["GetUserList", userPrefetchQueryParams],
    () => {
      return UserRepository.getUserList(userPrefetchQueryParams);
    },
    {
      staleTime: 10 * 60 * 1000,
      cacheTime: 30 * 60 * 1000,
    }
  );
};

export const useDeleteUsers = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (checkedUserIds: string[]) => {
      return await Promise.all(
        checkedUserIds.map((userId) => UserRepository.deleteUser(userId))
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["GetUserList"]);
    },
  });
};

export const useUserDetail = (userId: string) => {
  return useQueries({
    queries: [
      {
        queryKey: ["userDetail", userId],
        queryFn: () => UserRepository.getUserDetail(userId),
      },
      {
        queryKey: ["userAccount", userId],
        queryFn: () => UserRepository.getUserAllAccount(userId),
      },
      {
        queryKey: ["userSetting", userId],
        queryFn: () => UserRepository.getUserSetting(userId),
      },
    ],
  });
};

export const useEditUserName = (id: string, value: any) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => UserRepository.editUserName(id, value),
    onSuccess: (res) => {
      queryClient.refetchQueries(["GetUserList"]);
    },
    // TODO: recoil로 error처리
    // onError: res => {
    //   setServerAuthError(handleHTTPResponseError(res));
    // },
  });
};

export const useCreateNewUser = (
  handleCloseModal: (toggleEvent: boolean) => void,
  errorCallback: () => void
) => {
  const queryClient = useQueryClient();

  const { mutate } = useMutation(
    (formData: FormDataType) => UserRepository.createNewUser(formData),
    {
      onSuccess: (res) => {
        handleCloseModal(false);
        queryClient.invalidateQueries(["GetUserList"]);
      },
      onError: (err: AxiosError) => {
        if (err.response?.data === "Email already exists") {
          return errorCallback();
        }
        alert("잠시 후 시도해 주세요");
      },
    }
  );
  return mutate;
};
