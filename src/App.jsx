// import "./App.css";
import { Table } from "./components/Table";
import { Chart } from "./components/Chart";
import { UrlForm } from "./components/UrlForm";
import { Navbar } from "./components/Navbar";

function App() {
  return (
    <>
    <Navbar />
    <div className="mx-20">          
      <UrlForm />
      <Table />
      <Chart />
    </div>
    </>
  );
}

export default App;
