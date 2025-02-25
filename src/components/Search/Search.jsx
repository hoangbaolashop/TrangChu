import { Input } from 'antd';
import { useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
const { Search } = Input;

const SearchInput = ({ value, onSearchChange, disabled }) => {   
    const dataTheLoai = useSelector(state => state.category.listCategorys.data)
    const [placeholder, setPlaceholder] = useState('');

    const strings = dataTheLoai?.map(item => `Tìm kiếm ${item.TenLoaiSP}...`);
    let currentStringIndex = 0;
    let currentCharIndex = 0;
  
    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentString = strings[currentStringIndex];
            const currentChar = currentString[currentCharIndex];

            setPlaceholder((prev) => prev + currentChar); // Thêm một ký tự vào placeholder

            currentCharIndex += 1;

            // Khi chuỗi đã hết, chuyển sang chuỗi tiếp theo
            if (currentCharIndex >= currentString.length) {
                currentCharIndex = 0;
                currentStringIndex = (currentStringIndex + 1) % strings.length;
                setPlaceholder(''); // Reset placeholder trước khi bắt đầu chuỗi mới
            }
        }, 210); // Tốc độ gõ chữ (mili giây)
  
        // Cleanup
        return () => clearInterval(intervalId);
    }, []);


    const handleSearchChange = async (e) => {
        const query = e.target.value; // Lấy giá trị nhập vào từ ô tìm kiếm
        console.log("query: ", query);
        
        onSearchChange(query);                     
    }    

    return (
        <>
        <Search 
        className="search-header" 
        placeholder={placeholder}
        value={value} 
        onChange={(e) => handleSearchChange(e)} 
        enterButton  
        disabled={disabled}
        addonAfter={
            <a href="javascript: void(0);" className="rts-btn btn-primary radious-sm with-icon">
                <div className="btn-text">Search</div>
                <div className="arrow-icon">
                    <i className="fa-light fa-magnifying-glass" />
                </div>
                <div className="arrow-icon">
                    <i className="fa-light fa-magnifying-glass" />
                </div>
            </a>
        }/>             
        </>
    )
}
export default SearchInput