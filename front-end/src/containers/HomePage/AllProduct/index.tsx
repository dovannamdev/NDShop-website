import { LoadingOutlined, SyncOutlined } from "@ant-design/icons";
import { Avatar, Card, Col, Pagination, Row, Skeleton, Spin } from "antd";
import Meta from "antd/lib/card/Meta";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import productApi from "../../../apis/productApi";
import ProductView from "../../../components/ProductView";
import "./index.scss"

const showProducts = (list: any) => {
  list = list ? list : [];
  return list.map((product: any, index: number) => {
    const { code, avt, name, price, discount, stock } = product;

    return (
      <Col key={index} span={12} sm={8} lg={6} xl={4}>
        <Link to={`/product/${code}`}>
          <ProductView
            className="m-auto"
            name={name}
            price={price}
            stock={stock}
            avtUrl={avt}
            discount={discount}
            height={420}
          />
        </Link>
      </Col>
    );
  });
};

const AllProduct = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [list, setList] = useState();
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const iconLoading = <LoadingOutlined style={{ fontSize: 30 }} spin />;

  useEffect(() => {
    setIsLoading(true);
    async function getAllProducts() {
      const response = await productApi.getAllProducts(page);
      if (!response) {
        setIsLoading(false);
        return;
      }
      const { data, count } = response.data;
      setList(data);
      setTotal(count);
      setIsLoading(false);
    }

    getAllProducts();

  }, [page]);
  return (
    <Row className="p-16 AllProduct" style={{ minHeight: 400 }} gutter={[16, 16]}>
      <Col span={24} className="bg-head">
        <div className="bg-header">
          TẤT CẢ SẨN PHẨM
        </div>
      </Col>
      {isLoading ? (
        <Spin
          className="trans-center"
          tip="Đang tải sản phẩm ..."
          size="large"
          indicator={iconLoading}
        />

      ) : (
        <>{showProducts(list)}
          <Col span={24}>
            <Pagination
              className="t-center"
              current={page}
              onChange={p => setPage(p)}
              total={total}
              showSizeChanger={false}
            />
          </Col>
        </>
      )}
    </Row>
  );
};

export default AllProduct;
