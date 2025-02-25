import React, { useEffect, useState } from 'react';
import { Button, Modal, notification } from 'antd';
import { FaArrowsSpin } from "react-icons/fa6";
import { fetchAllVoucher } from '../../services/voucherAPI';
import { fetchAllHopQua, nhanThuong, quaySoHopQua } from '../../services/hopQuaAPI';
import { useSelector } from 'react-redux';
import { Wheel } from 'react-custom-roulette'



const LuckyWheel = () => {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);
  const [modalVisible, setModalVisible] = useState(false); 
  const [showFireworks, setShowFireworks] = useState(false);
  const [dataVoucher, setDataVoucher] = useState([])
  const [dataHopQua, setDataHopQua] = useState([])
  const customerId = useSelector(state => state.accountKH.user._id)

  const fetchTatCaVoucher = async () => {
      let query = 'page=1&limit=1000'
      let res = await fetchAllVoucher(query)
      if(res && res.data){
          setDataVoucher(res.data)
      }
  }
  const fetchTatCaHopQua = async () => {
    let query = 'page=1&limit=1000'
    let res = await fetchAllHopQua(query)
    console.log("res: ", res);    
    if(res && res.data){
      console.log("Response data:", res.data);
      setDataHopQua(res.data)
    }
  } 

  useEffect(() => {
      fetchTatCaVoucher()
  }, [])

  useEffect(() => {
    fetchTatCaHopQua()
}, [])

  useEffect(() => {
    if (customerId) {
      fetchTatCaHopQua();
    } else {
      console.log("customerId is not defined");
    }
  }, [customerId]);

   

  console.log("dataHopQua: ", dataHopQua);
  console.log("customerId: ", customerId);
  console.log("prizeNumber: ", prizeNumber);
  
  const data = (Array.isArray(dataHopQua) && dataHopQua.length > 0) ? dataHopQua.map((item) => (
    {
      _id: item?._id,
      option: item?.tenHopQua,
      message: item?.messageHopQua || 'Chúc bạn may mắn lần sau!',
      IdVoucher: item?.IdVoucher || null,
      IdKH: item?.IdKH || [],
    }
  )) : [];

  const data1 = [
    { _id: null, message: 'Chúc bạn may mắn lần sau!', option: 'Không có quà' }, // Quà không có voucher
    { _id: dataVoucher[0]?._id, message: dataVoucher[0]?.code, option: 'Quà số 2 🧧🎁' }, // Quà có voucher
    { _id: null, message: 'Chúc bạn may mắn lần sau!', option: 'Không có quà' }, // Quà không có voucher
    { _id: dataVoucher[1]?._id, message: dataVoucher[1]?.code, option: 'Quà số 4 🧧🎁' }, // Quà có voucher
    { _id: null, message: 'Chúc bạn may mắn lần sau!', option: 'Không có quà' }, // Quà không có voucher
    { _id: dataVoucher[2]?._id, message: dataVoucher[2]?.code, option: 'Quà số 6 🧧🎁' }, // Quà có voucher
    { _id: null, message: 'Chúc bạn may mắn lần sau!', option: 'Không có quà' }, // Quà không có voucher
  ];

  console.log("data: ", data);
 
  const handleSpinComplete = () => {
    setShowFireworks(true);   

    // Hiển thị modal với phần thưởng trúng
    setModalVisible(true);
    setShowFireworks(false);
    
  };

  const handleCancel = () => {
    setModalVisible(false);
    setMustSpin(false);
  }

  const nhanThuongSubmit = async () => {
    try {
        if (!data[prizeNumber].IdVoucher._id) {
            return notification.error({
                message: 'Nhận thưởng không thành công!',
                description: 'Không có quà nhận từ hộp quà này!',
            });
        }
        let res = await nhanThuong(customerId, data[prizeNumber].IdVoucher._id);

        if (res.errCode === 0) {
            notification.success({
                message: 'Nhận thưởng thành công!',
                description: 'Chúc mừng bạn đã nhận được quà tặng từ chúng tôi!',
            });
        } else {
            notification.error({
                message: 'Nhận thưởng không thành công!',
                description: res.message || 'Có lỗi xảy ra khi nhận thưởng!',
            });
        }

        handleCancel();
    } catch (error) {
        notification.error({
            message: 'Nhận thưởng không thành công!',
            description: error.message,
        });
    }
  }

  const handleSpinClick = async () => {
    try {
        // Kiểm tra nếu không có customerId, không thể quay số
        if (!customerId) {
            return notification.error({
                message: 'Quay số không thành công!',
                description: 'Vui lòng đăng nhập để quay số!',
            });
        }

        // Gọi API quay số
        let qso = await quaySoHopQua(customerId);

        // Kiểm tra nếu người dùng đã hết lượt quay
        if (qso.errCode === -1) {
            return notification.error({
                message: 'Quay số không thành công!',
                description: 'Bạn đã hết lượt quay số may mắn!',
            });
        }

        // Nếu quay số thành công, tiến hành quay và hiển thị thông báo
        if (qso.errCode === 0) {
            setMustSpin(true);
            setPrizeNumber(Math.floor(Math.random() * data.length));

            notification.warning({
                message: 'Đang quay số trúng thưởng, vui lòng chờ để nhận quà...',
                description: `Số lượt quay còn lại: ${qso.quayMayManCount}`,
            });
        }
    } catch (error) {
        // Xử lý lỗi khi xảy ra
        notification.error({
            message: 'Quay số không thành công!',
            description: error.message,
        });
    }
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', }}>
        {data.length > 0 ? (          
          <Wheel
              mustStartSpinning={mustSpin}
              prizeNumber={prizeNumber}
              data={data} 
              backgroundColors={[
                '#FF6384', // Màu đỏ
                '#36A2EB', // Màu xanh dương
                '#FFCE56', // Màu vàng
                '#4BC0C0', // Màu xanh ngọc
                '#9966FF', // Màu tím
                '#FF9F40', // Màu cam
                '#FF6347', // Màu đỏ tươi
                '#00CCFF', // Màu xanh da trời
                '#66CDAA', // Màu xanh lá cây nhạt
                '#FFA500', // Màu cam sáng
                '#800080', // Màu tím đậm
                '#22C1C3', // Màu xanh biển nhạt
              ]}
              textColors={['#ffffff']}
              outerBorderWidth={2} // Viền mỏng hơn
              radiusLineWidth={2} // Đường kẻ giữa các phần mỏng hơn
              fontSize={14} // Kích thước chữ nhỏ hơn           
              onStopSpinning={handleSpinComplete}
          />
        ) : (
          <p>Loading...</p>
        )} 


        <Button
            type="primary"
            size='large'
            icon={<FaArrowsSpin />}
            onClick={handleSpinClick}
            style={{ marginTop: '20px', borderRadius: '20px' }}
            disabled={mustSpin} // Ngăn chặn bấm nhiều lần khi đang quay
        >
            Click vào đây để quay số trúng thưởng
        </Button>

        <Modal
        title="💥💥💥Trúng rồi kìa!"
        visible={modalVisible}
        onCancel={handleCancel}
        maskClosable={false}
        footer={[
          <div>
          <Button key="close" onClick={handleCancel} style={{width: "45%"}}>
            Close
          </Button>
          {data[prizeNumber] && data[prizeNumber].IdVoucher && data[prizeNumber].IdVoucher._id ? (
            <Button onClick={nhanThuongSubmit} style={{width: "45%", marginLeft: "10%"}}>
              Nhận thưởng
            </Button>
          ) : ''}           
          </div>
        ]}
      >
        <p style={{ color: "green" }}>{data[prizeNumber]?.message || "Không xác định"}</p>
        <p>Bạn đã quay vào ô <span style={{ color: "red" }}>{data[prizeNumber]?.option || "Không xác định"}</span></p>
        {data[prizeNumber]?.IdVoucher ? (
          <p>
            🎁 Giải thưởng là: <br /><br />
            <span style={{ color: "red" }}>
              CODE: &nbsp; {data[prizeNumber]?.IdVoucher?.code} <br/> <span style={{ color: "navy" }}>Điều kiện áp dụng tổng đơn hàng trên </span>
              {data[prizeNumber]?.IdVoucher?.dieuKien
                ? Number(data[prizeNumber]?.IdVoucher.dieuKien).toLocaleString("vi-VN", {
                    style: "currency",
                    currency: "VND",
                  })
                : "Không có điều kiện"
              } 
              <br/> <span style={{ color: "navy" }}>Được giảm: </span> 
              {data[prizeNumber]?.IdVoucher?.giamGia}% <span style={{ color: "navy" }}>tổng giá trị đơn hàng </span>  
              <br /><br />
            </span>
              <span style={{ fontSize: "16px" }}>
                  ⌚ Ngày hết hạn: <span style={{ color: "red" }}>{data[prizeNumber]?.IdVoucher?.thoiGianHetHan}</span>
              </span>
          </p>
        ) : (
          <p>Tiếc quá, hộp quà này không có giải thưởng 😭😭</p>
        )}
      </Modal>
    </div>
  );
};

export default LuckyWheel;
