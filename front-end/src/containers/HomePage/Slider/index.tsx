import { ArrowLeftOutlined, ArrowRightOutlined } from "@ant-design/icons";
import { Carousel } from "antd";
import React from "react";
import "./index.scss";

const list = [
  "https://lh3.googleusercontent.com/Koz7yuvXvVwfQ2zrfJzvPNt6UiHp2DbGwKKs1WMudxZQ6s-8M3pG7KsTDd-67BZtR9-YjcPNIZ2BkVh1EXpv0UnAY_aqilWQ=rw-w1920",
  "https://cdn.hoanghamobile.com/i/home/Uploads/2022/07/30/web-dell-01.jpg",
  "https://lh3.googleusercontent.com/minZUXR0F9pBoL2cjK2BVqGYchRDQeI7kEyqRxLE_8slYcuJXSG8XGZSyTXRbSqG-VvtkikXPsPr7POs5spxpterle_TMYNp=rw-w1920",
  "https://cdn.hoanghamobile.com/i/home/Uploads/2022/07/29/web-mac-m2-air-01.jpg",
  "https://cdn.hoanghamobile.com/i/home/Uploads/2022/07/29/banner-huawei-1.png",
  "https://lh3.googleusercontent.com/N0f0Q5LOF9UWZLVjWgm0FrU9C2TCmeEmbDa-UPW0kuwiAWY8Dv5LSFygKVZz-WNKz-mjNqHAbMogV30kG8RHbyliBLwdeNE=rw-w1920",
  "https://lh3.googleusercontent.com/q4Knj3SkeQJeR8dyfilKzqMfuQyIkbRg8_y4ayyco5lNvYki_oSB8PCycwSj8Fqifcm8NpGJiEd48boGfLl5TGZaKqEYVTvb8g=rw-w1920",
  "https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608134777/saleOff/carousels/7_gokjlq.webp",
  "https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608134777/saleOff/carousels/12_crycbe.webp",
  "https://res.cloudinary.com/tuan-cloudinary/image/upload/v1608134778/saleOff/carousels/13_ytp67u.webp",
];

const Slider = () => {
  return (
    <>
    <Carousel autoplay swipeToSlide draggable  arrows={true}>
      {list.map((item, index) => (
        <img className="Sale-Off-img" src={item} key={index} alt=""/>
      ))}
    </Carousel>
    </>
  );
};
export default Slider;
