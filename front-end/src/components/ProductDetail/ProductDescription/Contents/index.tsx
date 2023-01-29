const Contents = (props: any) => {
  const { productDesc, desTitle } = props;
  return (
    <>
      {!productDesc ? (
        <h3 className="m-t-16">Thông tin đang được cập nhật</h3>
      ) : (
        <>
          <h2 className="m-t-16 m-b-8 font-weight-700">{desTitle}</h2>
          {productDesc?.length &&
            productDesc?.map((item: any, index: any) => (
              <div key={index}>
                <p className="t-justify font-size-15px font-weight-500 desc-detail">
                  {item.content}
                </p>
                <img
                  className="trans-margin"
                  style={{ maxHeight: 350, maxWidth: "100%" }}
                  src={item.photo} alt=""
                />
              </div>
            ))}
        </>
      )}
    </>
  );
};
export default Contents;
