import { Button, Col, InputNumber, Row, Slider, Spin } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./index.scss";
import productNotFoundUrl from "../../assets/img/no-products-found.png";
import GlobalLoading from "../GlobalLoading";
import ProductView from "../ProductView";
import productApi from "../../apis/productApi";

const ResultSearch = (props: any) => {
  const { initList } = props;
  const [list, setList] = useState([...initList]);
  const [isLoading, setIsLoading] = useState(false);
  const [priceFilter, setPriceFilter] = useState({ from: 1, to: 1 });
  const [sortBtnActive, setSortBtnActive] = useState(0);
  const sortButtons = [
    { key: 1, title: "Giá giảm dần" },
    { key: 2, title: "Giá tăng dần" },
    { key: 3, title: "Khuyến mãi tốt nhất" },
  ];

  const showProducts = (list: any) => {
    list = list ? list : [];
    return list?.map((product: any, index: number) => {
      const { avt, name, price, discount, stock, code } = product;
      return (
        <Col key={index} span={24} sm={12} lg={8} xl={4}>
          <Link to={`/product/${code}`}>
            <ProductView
              className={"product"}
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

  const onSort = (type = 0) => {
    if (type === sortBtnActive) {
      // trả về danh sách ban đầu
      setList([...initList]);
      setSortBtnActive(0);
      return;
    } else {
      // loading
      setIsLoading(true);
      setSortBtnActive(type);
    }

    let newList: any[] = [];
    switch (type) {
      case 1:
        newList = list.sort((a, b) => b.price - a.price);
        break;
      case 2:
        newList = list.sort((a, b) => a.price - b.price);
        break;
      case 3:
        newList = list.sort((a, b) => b.discount - a.discount);
        break;
      default:
        setIsLoading(false);
        break;
    }

    setTimeout(() => {
      setIsLoading(false);
      setList(newList);
    }, 200);
  };

  useEffect(() => {
    setList(initList);
  }, [initList]);

  const filterProduct = () => {
    props.handleSort(priceFilter?.from, priceFilter?.to);
  };

  return (
    <Row className="Result-Search bor-rad-8 box-sha-home bg-white m-tb-32">
      <Col span={24} className="sort-wrapper p-lr-16">
        <div className="sort p-tb-10 d-flex align-i-center">
          <h3 className="m-r-8 font-weight-700">Sắp xếp theo</h3>
          {sortButtons.map((item) => (
            <Button
              className={`${
                item.key === sortBtnActive ? "ant-btn-primary" : ""
              } m-4 bor-rad-4`}
              key={item.key}
              size="large"
              onClick={() => onSort(item.key)}
            >
              {item.title}
            </Button>
          ))}
        </div>
        <div style={{ marginBottom: "10px" }}>
          <Row>
            <Col span={4}>Từ: </Col>
            <Col span={12}>
              <Slider
                min={1}
                max={100000000}
                onChange={(price) =>
                  setPriceFilter({ ...priceFilter, from: price })
                }
                value={
                  typeof priceFilter?.from === "number" ? priceFilter?.from : 1
                }
              />
            </Col>
            <Col span={4}>
              <InputNumber
                min={1}
                max={100000000}
                style={{ margin: "0 16px" }}
                parser={(value: any) => value.match(/^\d+$/)}
                value={priceFilter?.from}
                onChange={(price:any) =>
                  setPriceFilter({ ...priceFilter, from: price })
                }
              />
            </Col>
          </Row>
          <Row style={{ marginTop: "10px" }}>
            <Col span={4}>Đến: </Col>
            <Col span={12}>
              <Slider
                min={1}
                max={100000000}
                onChange={(price) =>
                  setPriceFilter({ ...priceFilter, to: price })
                }
                value={
                  typeof priceFilter?.to === "number" ? priceFilter?.to : 1
                }
              />
            </Col>
            <Col span={4}>
              <InputNumber
                min={1}
                max={100000000}
                style={{ margin: "0 16px" }}
                parser={(value: any) => value.match(/^\d+$/)}
                value={priceFilter?.to}
                onChange={(price:any) =>
                  setPriceFilter({ ...priceFilter, to: price })
                }
              />
            </Col>
            <Col span={4}>
              <Button type="primary" onClick={() => filterProduct()}>
                Search
              </Button>
            </Col>
          </Row>
        </div>
      </Col>
      <Col span={24} className="Result-Search-list p-16">
        {!list || list.length === 0 ? (
          <div className="trans-center d-flex flex-direction-column pos-relative">
            <img
              className="not-found-product m-0-auto"
              src={productNotFoundUrl}
              alt="images"
            />
            <span className="font-size-16px m-t-8 t-center">
              Không sản phẩm nào được tìm thấy
            </span>
          </div>
        ) : isLoading ? (
          <GlobalLoading content={"Đang cập nhật sản phẩm ..."} />
        ) : (
          <Row gutter={[8, 16]}>{showProducts(list)}</Row>
        )}
      </Col>
    </Row>
  );
};
export default ResultSearch;
