import AnnotationChart from "./components/AnnotationChart";
import BarStackChart from "./components/BarStackChart";
import BarsChart from "./components/BarsChart";
import CurvesChart from "./components/CurvesChart";

function App() {
  const containerStyle = {
    width: 830,
    height: 480,
    position: "relative",
    display: "flex",
    margin: "4rem auto ",
  };
  return (
    <>
      <div style={containerStyle}>
        <BarStackChart />
      </div>
      <div style={containerStyle}>
        <CurvesChart />
      </div>
      <div style={containerStyle}>
        <BarsChart />
      </div>
      <div style={containerStyle}>
        <AnnotationChart />
      </div>
    </>
  );
}

export default App;
