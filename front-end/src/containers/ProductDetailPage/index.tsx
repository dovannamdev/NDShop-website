import { message } from "antd";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import productApi from "../../apis/productApi";
import GlobalLoading from "../../components/GlobalLoading";
import ProductDetail from "../../components/ProductDetail";
import helpers from "../../helpers";

const ProductDetailPage = () => {
  const { productCode } = useParams();
  const [product, setProduct] = useState();
  const [isNotFoundProduct, setIsNotFoundProduct] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const getProduct = async (code: any) => {
      try {
        const result = await productApi.getProduct(code);
        if (!result?.data?.product) {
          setIsNotFoundProduct(true);
          return;
        }
        const newResultData = {...result.data}
        setProduct(newResultData);
      } catch (error) {
        setIsNotFoundProduct(true);
      }
    };
    getProduct(productCode);
  }, []);

  return (
    <>
      {product ? (
        <ProductDetail products={product} />
      ) : (
        <GlobalLoading content={"Đang tải sản phẩm ..."} />
      )}
      {isNotFoundProduct && navigate("/not-found")}
    </>
  );
};
export default ProductDetailPage;
