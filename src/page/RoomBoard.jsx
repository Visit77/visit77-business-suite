import React, { useEffect, useState } from "react";
import { CheckCircleFilled } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { selectBusinessId } from "../service/businessSlice";
import { getRoomBoard, roomBoardSelector } from "../service/roomBoardSlice";
import moment from "moment";
import { buildingSelector, getHotelBuilding } from "../service/buildingSlice";
import PageLoading from "../components/PageLoading";

const getRoomCardStyle = (status) => {
  switch (status) {
    case "available":
      return "bg-green-400/40 border-green-400"; // rgba(187, 247, 208, 1)
    case "occupied":
      return "bg-blue-600/40 border-blue-600"; // rgba(37, 99, 235, 1)
    case "reserved":
      return "bg-[#FB923C]/40 border-[#FB923C]"; // bg-orange-400
    case "cleaning":
      return "bg-[#7C3AED]/40 border-[#7C3AED]"; // bg-violet-600
    case "out_of_service":
      return "bg-slate-500/40 border-slate-500"; // rgba(100, 116, 139, 1)
    default:
      return "bg-green-200/40 border-green-200";
  }
};

const getDotColor = (status) => {
  switch (status) {
    case "available":
      return "bg-green-400 border-green-400"; // rgba(187, 247, 208, 1)
    case "occupied":
      return "bg-blue-600 border-blue-600"; // rgba(37, 99, 235, 1)
    case "reserved":
      return "bg-[#FB923C] border-[#FB923C]"; // bg-orange-400
    case "cleaning":
      return "bg-[#7C3AED] border-[#7C3AED]"; // bg-violet-600
    case "out_of_service":
      return "bg-slate-500 border-slate-500"; // rgba(100, 116, 139, 1)
    default:
      return "bg-green-200 border-green-200";
  }
};
const RoomBoard = () => {
  const [activeTab, setActiveTab] = useState();
  const businessId = useSelector(selectBusinessId);
  const dispatch = useDispatch();
  const { data: building, isPending: isBuildingPending } =
    useSelector(buildingSelector);
  const { data: roomBoard, isPending } = useSelector(roomBoardSelector);

  useEffect(() => {
    dispatch(
      getHotelBuilding({
        business_id: businessId,
      }),
    );
  }, [businessId, dispatch]);
  useEffect(() => {
    dispatch(
      getRoomBoard({
        business_id: businessId,
        date: moment().format("YYYY-MM-DD"),
        building_id: activeTab,
      }),
    );
  }, [businessId, dispatch, activeTab]);

  if (isBuildingPending || isPending) {
    return <PageLoading message="Loading business data..." />;
  }

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-6 font-sans text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="border-b border-slate-200 flex gap-8 text-sm font-semibold text-slate-500">
          {building.map((build) => (
            <button
              key={build?.id}
              onClick={() => setActiveTab(build?.id)}
              className={`pb-3 transition-all relative ${
                activeTab === build?.id
                  ? "text-[#0F296D] font-bold border-b-2 border-[#0F296D]"
                  : "hover:text-slate-700"
              }`}
            >
              {build?.name}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100">
          <div className="text-center px-4">
            <div
              className={`text-2xl md:text-3xl font-extrabold text-[#D4A017]`}
            >
              {roomBoard?.summary?.floors}
            </div>
            <div className="text-[10px] md:text-xs font-bold text-slate-400 tracking-wider mt-1 ">
              Floors
            </div>
          </div>
          <div className="text-center px-4">
            <div
              className={`text-2xl md:text-3xl font-extrabold text-[#0F296D]`}
            >
              {roomBoard?.summary?.total_rooms}
            </div>
            <div className="text-[10px] md:text-xs font-bold text-slate-400 tracking-wider mt-1 ">
              Rooms
            </div>
          </div>
          <div className="text-center px-4">
            <div
              className={`text-2xl md:text-3xl font-extrabold text-[#10B981]`}
            >
              {roomBoard?.summary?.available}
            </div>
            <div className="text-[10px] md:text-xs font-bold text-slate-400 tracking-wider mt-1 ">
              Available
            </div>
          </div>
          <div className="text-center px-4">
            <div
              className={`text-2xl md:text-3xl font-extrabold text-[#3B82F6]`}
            >
              {roomBoard?.summary?.occupied}
            </div>
            <div className="text-[10px] md:text-xs font-bold text-slate-400 tracking-wider mt-1 ">
              Occupied
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {roomBoard?.floors?.map((floor, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-xs space-y-5"
            >
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-baseline space-x-2">
                  <h3 className="text-lg font-bold text-slate-900">
                    {floor?.building} &nbsp; Floor {floor?.floor}
                  </h3>
                  <span className="text-xs font-medium text-slate-400">
                    ({floor.total_rooms} Rooms)
                  </span>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-wider text-white ${getDotColor("available")}`}
                  >
                    {floor?.counts?.available} AVL
                  </span>
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-wider text-white ${getDotColor("occupied")}`}
                  >
                    {floor?.counts?.occupied} OCC
                  </span>
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-wider text-white ${getDotColor("reserved")}`}
                  >
                    {floor?.counts?.reserved} RSV
                  </span>
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-wider text-white ${getDotColor("cleaning")}`}
                  >
                    {floor?.counts?.cleaning} CLN
                  </span>
                  <span
                    className={`px-3 py-1 rounded-lg text-[10px] font-extrabold tracking-wider  text-white ${getDotColor("out_of_service")}`}
                  >
                    {floor?.counts?.out_of_service} OOS
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {floor?.rooms?.map((room, rIdx) => (
                  <div
                    key={rIdx}
                    className={`relative h-20 rounded-xl border p-3 flex items-center justify-center font-bold text-sm transition-transform hover:scale-[1.02] cursor-pointer bg-op ${getRoomCardStyle(
                      room.display_status,
                    )}`}
                  >
                    {room.checked && (
                      <CheckCircleFilled className="absolute top-2 left-2 text-[#10B981] text-xs" />
                    )}

                    <span
                      className={`absolute top-1 right-2 w-2 h-2 rounded-full ${getDotColor(room.display_status)}`}
                    />

                    <span className="tracking-wide">{room.room_number}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RoomBoard;
