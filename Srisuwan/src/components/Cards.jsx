import bedImg from '../assets/bed.svg';

const Cards = () => {
  return (
    <div>
      <div className="card" style={{ width: "18rem" }}>
        <img src={bedImg} className="card-img-top" alt="Bed" />
        <div className="card-body">
          <h5 className="card-title">Room 101</h5>
          <p className="card-text">ห้องพักที่สะดวกสะบาย</p>
          <a href="#" className="btn btn-primary">เช่า</a>
        </div>
      </div>
    </div>
  );
};

export default Cards;
