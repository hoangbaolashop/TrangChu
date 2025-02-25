import { Input, Space } from 'antd';
const { Search } = Input;

const SearchMobile = ({ value, onSearchChange }) => {

    const handleSearchChange1 = (e) => {
        const query = e.target.value; // Lấy giá trị nhập vào từ ô tìm kiếm
        console.log("query: ", query);
        console.log("onSearchChange: ", onSearchChange);
        
        if (onSearchChange) {  // Kiểm tra trước khi gọi onSearchChange
            onSearchChange(query);  // Gọi hàm onSearchChange đã truyền vào từ Header
        }
    }

    return (
        <div>
            <div className="search-input-area">
                <div className="container">
                    <div className="search-input-inner">
                    <div className="input-div">
                        <Search 
                            size='large'
                            className="search-input" 
                            placeholder="Tìm kiếm ở đây..." 
                            value={value} 
                            onChange={(e) => handleSearchChange1(e)} 
                            enterButton  
                        />                        
                    </div>
                    </div>
                </div>
                <div id="close" className="search-close-icon"><i className="far fa-times" /></div>
            </div>
            <div id="anywhere-home" className="anywere" />
        </div>
    )
}
export default SearchMobile