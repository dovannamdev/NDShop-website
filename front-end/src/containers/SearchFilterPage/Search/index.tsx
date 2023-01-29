import { Pagination } from "antd";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import productApi from "../../../apis/productApi";
import GlobalLoading from "../../../components/GlobalLoading";
import ResultSearch from "../../../components/ResultSearch";
import helpers from "../../../helpers";

const SearchResult = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  const search = useLocation().search;
  const query = helpers.queryString(search);

  let keyword = query.find((item) => item.hasOwnProperty("keyword"));
  let keywordValue = "";
  if (keyword !== undefined)
    keywordValue = decodeURI(keyword.keyword.replace(/[+]/gi, " "));

  async function getSearchProducts(currentPage: any, isSubscribe: any) {
    try {
      const result = await productApi.getSearchProducts(
        keywordValue,
        currentPage,
        12
      );
      if (result && isSubscribe) {
        const { list, count } = result.data;
        setList(list);
        setTotal(count);
        setIsLoading(false);
      }
    } catch (error) {
      setList([]);
      setTotal(0);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    let isSubscribe = true;
    setIsLoading(true);
    if (page !== 1) setPage(1);
    getSearchProducts(1, isSubscribe);

    // clean up
    return () => {
      isSubscribe = false;
    };
  }, [search]);

  useEffect(() => {
    let isSubscribe = true;
    setIsLoading(true);
    getSearchProducts(page, isSubscribe);
    // clean up
    return () => {
      isSubscribe = false;
    };
  }, [page]);

  const handleSort = async (priceFrom: any, priceTo: any) => {
    try {
      const result = await productApi.getSearchProducts(
        keywordValue,
        1,
        12,
        priceFrom,
        priceTo 
      );

      if (result) {
        const { list, count } = result.data;
        setList(list);
        setTotal(count);
        setIsLoading(false);
      }
    } catch (error) {
      console.log("sort error >>>> ", error);
    }
  };

  return (
    <div className="container m-tb-50" style={{ minHeight: "65vh" }}>
      {!isLoading && (
        <h2 className="font-size-24px">
          Tìm được <b>{total}</b> sản phẩm{" "}
          {keywordValue !== "" ? `cho "${keywordValue}"` : ""}
        </h2>
      )}

      {isLoading ? (
        <GlobalLoading content={"Đang tìm kiếm sản phẩm phù hợp ..."} />
      ) : (
        <>
          {/* Kết quả lọc, tìm kiếm */}
          <ResultSearch
            initList={list}
            handleSort={(priceFrom: any, priceTo: any) =>
              handleSort(priceFrom, priceTo)
            }
          />
          {/* pagination */}
          {total > 0 && (
            <Pagination
              className="m-tb-16 t-center"
              total={total}
              current={page}
              showSizeChanger={false}
              pageSize={12}
              onChange={(p) => setPage(p)}
            />
          )}
        </>
      )}
    </div>
  );
};

export default SearchResult;
