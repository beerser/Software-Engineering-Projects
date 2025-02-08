const Cards = ({ obj }) => {
    return (
      <div style={{ 
        display: "flex", 
        gap: "1rem", 
        overflowX: "scroll", 
        scrollSnapType: "x mandatory", 
        padding: "1rem",
        scrollbarWidth: "none", 
        msOverflowStyle: "none" 
      }}
      className="scroll-container"
      >
        {obj.map((item, index) => (
          <div 
            key={index} 
            className="card" 
            style={{ 
              width: "13rem",
              padding: "10px",
              scrollSnapAlign: "start",
              flex: "0 0 auto",
              borderRadius: "15px",
              margin: "7px",
              boxShadow: "5px 5px 15px rgba(0, 0, 0, 0.1)"
            }}
          >
            <img src={item.url} className="card-img-top" alt={item.title} />
            <div className="card-body">
              <h5 className="card-title">{item.title}</h5>
              <p className="card-text">{item.content}</p>
              <a href="#" className="btn btn-primary">เช่า</a>
            </div>
          </div>
        ))}
      </div>
    );
  };
  
  export default Cards;
  