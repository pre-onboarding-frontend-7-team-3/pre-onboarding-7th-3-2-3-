import { useMemo, useState } from "react";
import * as S from "./UserList.style";

import { Table, TableContainer, Paper } from "@mui/material";
import SearchInput from "../common/SearchInput/SearchInput";
import PagenationButton from "../InvestmentAccountList/PagenationButton/PagenationButton";
import { useGetUserListQuery } from "./UserList-query/UserList.query";
import CustomTableBody from "../common/Table/CustomTableBody";
import { GENDER, USER_TABLE_CELL_DATA } from "@src/constants/tableData";
import CustomTableHead from "../common/Table/CustomTableHead";
import { formatBoolean } from "@src/utils/formatBoolean";
import { maskingPhoneNumber, maskingUserName } from "@src/utils/processData";

import NewUserModal from "../NewUserModal";

const UserList = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [accountQueryParams, setAccountQueryParams] = useState({
    pageLimit: currentPage,
  });
  const maxPage = 5;

  const { data, isLoading, isError } = useGetUserListQuery(accountQueryParams);
  
  const handleCurrentPage = (num: number) => {
    setCurrentPage(num);
    setAccountQueryParams(prev => {
      return {
        ...prev,
        pageLimit: num,
      };
    });
  };

  const userData = useMemo(
    () =>
      data?.data?.map((data: { [key: string]: any }) => ({
        name: maskingUserName(data.name),
        account_count: Math.floor(Math.random() * 10),
        email: data.email,
        gender_origin: GENDER[data.gender_origin],
        birth_date: data.birth_date?.split("").slice(0, 10),
        phone_number: maskingPhoneNumber(data.phone_number),
        last_login: data.last_login?.split("").slice(0, 10),
        allow_marketing_push: formatBoolean(
          data?.userSetting[0]?.allow_invest_push
        ),
        is_active: formatBoolean(data.userSetting[0]?.is_active),
        created_at: data.created_at?.split("").slice(0, 10),
        id: data.id,
        uuid: data.uuid,
      })),
    [data]
  );

  if (isLoading) return <h3>Loading...</h3>;
  if (isError)
    return (
      <>
        <h3>error...</h3>
      </>
    );

  return (
    <>
      <S.Container>
        <S.FilterContainer>
          <SearchInput
            onUpdateParams={setAccountQueryParams}
            text="고객명 검색"
          />
        </S.FilterContainer>
        <S.AddNewUserButton onClick={() => setIsModalOpen((prev) => !prev)}>
          신규 고객 추가
        </S.AddNewUserButton>
      </S.Container>
      <TableContainer component={Paper} sx={S.customTableStyle.container}>
        <Table sx={S.customTableStyle.table} aria-label="simple table">
          <CustomTableHead data={USER_TABLE_CELL_DATA} />
          <CustomTableBody data={userData} />
        </Table>
      </TableContainer>
      <PagenationButton
        currentPage={currentPage}
        maxPage={maxPage}
        handlePageNum={handleCurrentPage}
      />
      {isModalOpen && <NewUserModal setIsModalOpen={setIsModalOpen} />}
    </>
  );
};

export default UserList;
