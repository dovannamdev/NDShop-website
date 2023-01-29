import "./index.scss";
import helpers from "../../../../helpers";

// fn: lấy danh sách thông số
function listSpecification(data: any) {
  let result = [];
  for (let key in data) {
    if (typeof data[key] === "object") {
      for (const k in data[key]) {
        result.push({ key: helpers.convertProductKey(k), value: data[key][k] });
      }
      continue;
    }
    result.push({ key: helpers.convertProductKey(key), value: data[key] });
  }

  return result;
}

const showSpecification = (list: any) => {
  return (
    list &&
    list.map((item: any, index: number) => {
      return (
        <div key={index} className="Specification-item d-flex p-12">
          <span className="font-size-16px" style={{ flexBasis: 150 }}>
            {item.key}
          </span>
          <span className="font-size-16px flex-grow-1">{item.value}</span>
        </div>
      );
    })
  );
};

const Specification = ({ specification }: any) => {
  const newSpecification = {
    brand: specification?.brandName,
    warranty: specification?.warranty,
    chipBrand: specification?.chipBrand,
    processorCount: specification?.processorCount,
    series: specification?.cpuSeries,
    detail: specification?.cpuDetail,
    displaySize: specification?.displaySize,
    display: specification?.display,
    operating: specification?.operating,
    disk: specification?.disk,
    ram: specification?.ram,
    pin: specification?.pin,
    weight: specification?.weight,
  }
  const list = [...listSpecification(newSpecification)];
  return <div className="Specification p-t-16">{showSpecification(list)}</div>;
};

export default Specification;
