import { Card, CardBody } from "reactstrap";

const TopCards = (props) => {
  return (
    <Card className="shadow-md flex flex-col items-center justify-center p-4">
      <CardBody className="flex flex-col items-center justify-center w-60">
        <div className={`circle-box ${props.bg} p-4 mb-3`}>
          <i className={`${props.icon} text-3xl`}></i>
        </div>
        <div className="text-center">
          <h3 className="text-xl font-bold text-black">{props.earning}</h3>
          <small className="text-black">{props.subtitle}</small>
        </div>
      </CardBody>
    </Card>
  );
};

export default TopCards;
