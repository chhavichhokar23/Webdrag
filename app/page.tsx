import LeftBar from "./components/LeftBar"
import Canvas from "./components/Canvas"
import RightBar from "./components/RightBar"
import Topbar from "./components/Topbar"

export default function Home() {
  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden">
      <Topbar />
      <div className="flex flex-1 overflow-hidden">
        <LeftBar />
        <Canvas />
        <RightBar />
      </div>
    </div>
  )
}
