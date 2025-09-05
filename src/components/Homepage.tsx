import { Link } from 'react-router-dom';
import '../styles/Homepage.css'; 

const Homepage = () => {
  return (
    <div className="homepage-container">
      <h1 className="homepage-title">React Veri Yönetimi Projesine Hoş Geldiniz</h1>
      <p className="homepage-subtitle">
        Bu demo, harici bir API'dan (JSONPlaceholder) veri çekmeyi, bu verileri 
        görüntülemeyi, eklemeyi, düzenlemeyi ve silmeyi göstermektedir.
      </p>
      <div className="homepage-buttons">
        <Link to="/users" className="homepage-button user-button">
          Kullanıcıları Görüntüle
        </Link>
        <Link to="/posts" className="homepage-button post-button">
          Gönderileri Görüntüle
        </Link>
      </div>
    </div>
  );
};

export default Homepage;