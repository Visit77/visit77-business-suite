import React, { useEffect, useState } from "react";
import { Avatar, Divider, message, Modal, Tag } from "antd";
import { getDotColor } from "../utils/utils";
import { useDispatch, useSelector } from "react-redux";
import { getOneRoom, roomBoardSelector } from "../service/roomBoardSlice";
import { selectBusinessId } from "../service/businessSlice";
import moment from "moment";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import PageLoading from "../components/PageLoading";
import _ from "lodash";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  Calendar03Icon,
  CalendarBlock01Icon,
  CalendarCheckIn01Icon,
  CalendarCheckOut01Icon,
  CardExchange01Icon,
  DashboardSquare01Icon,
  FileClockIcon,
  InformationCircleIcon,
  Moon02Icon,
  Settings01Icon,
  SquareLockRemove01Icon,
  User02Icon,
} from "@hugeicons/core-free-icons";
import OutOfServiceModal from "../components/modal/OutOfServiceModal";
import RoomBlockModal from "../components/modal/RoomBlockModal";
import { finalVerifiedCheckIn, roomUnblock } from "../service/actionSlice";
import CheckOutModal from "../components/modal/CheckOutModal";
import CleanRoomModal from "../components/modal/CleanRoomModal";
import FinishRepairModal from "../components/modal/FinishRepairModal";

const RoomDetailsPage = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const businessId = useSelector(selectBusinessId);
  const { details: roomData, isPending } = useSelector(roomBoardSelector);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBlockModalOpen, setIsBlockModalOpen] = useState(false);
  const [isCheckOutModalOpen, setIsCheckOutModalOpen] = useState(false);
  const [isCleanModalOpen, setIsCleanModalOpen] = useState(false);
  const [isRepairModalOpen, setIsRepairModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(
        getOneRoom({
          business_id: businessId,
          date: moment().format("YYYY-MM-DD"),
          id: id,
        }),
      );
    }
  }, [id, businessId, dispatch]);

  if (isPending) {
    return <PageLoading message="Loading room data..." />;
  }

  const renderRoomDetailsBtn = () => (
    <button
      onClick={() => {
        navigate(`/rooms/${roomData?.core_physical_room_id}`);
      }}
      className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border border-neutral-100 cursor-pointer"
    >
      <HugeiconsIcon
        icon={InformationCircleIcon}
        className="text-primary-400"
      />
      <span>Room Details</span>
    </button>
  );

  const renderRoomHistoryBtn = () => (
    <button className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border border-neutral-100 cursor-pointer">
      <HugeiconsIcon icon={FileClockIcon} className="text-primary-400" />
      <span>Room History</span>
    </button>
  );

  return (
    <div className="min-h-screen bg-[#F5F7FB] p-8">
      <div className="space-y-5">
        {/* 2. Top Banner: Room Info & Pricing */}
        <div className="bg-white rounded-2xl p-6 border border-neutral-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-black text-neutral-900">
                #{roomData?.room_number}
              </h1>

              <span
                className={`${getDotColor(roomData?.display_status)} capitalize ${
                  roomData?.display_status == "blocked"
                    ? "text-black"
                    : "text-white"
                } text-xs font-semibold px-3 py-1 rounded-full`}
              >
                {roomData?.display_status}
              </span>
              {roomData?.next_reservations?.length > 0 && (
                <>
                  {roomData?.display_status != "reserved" && (
                    <span
                      className={`${getDotColor("reserved")} capitalize text-white text-xs font-semibold px-3 py-1 rounded-full`}
                    >
                      reserved
                    </span>
                  )}

                  <span
                    className={`${getDotColor("reserved")} capitalize text-white text-xs font-semibold px-3 py-1 rounded-full`}
                  >
                    {roomData?.next_reservations?.length}
                  </span>
                </>
              )}
            </div>
            <p className="text-xs font-medium text-neutral-500 mt-1.5">
              {roomData?.room_type?.name} &nbsp;
              {_.map(roomData?.core_snapshot?.beds, (bed, index) => {
                return (
                  <span key={index}>.&nbsp;{bed?.bed_type?.name}&nbsp;</span>
                );
              })}
              {roomData?.core_snapshot?.room_view?.name && (
                <span>.&nbsp;{roomData?.core_snapshot?.room_view?.name}</span>
              )}
              {roomData?.core_snapshot?.room_area && <span>.&nbsp;</span>}
              {roomData?.core_snapshot?.room_area}
              {roomData?.core_snapshot?.area_unit}
            </p>
          </div>

          {/* Price Box */}
          <div className="bg-[#F4F7FC] rounded-xl p-3.5 flex items-center justify-between ">
            {_.map(roomData?.room_type?.rate_plans, (plan) => {
              return (
                <div key={plan?.id || plan?.guest_market} className="pr-5">
                  <div className="text-md font-semibold text-neutral-500">
                    {plan?.guest_market == "local"
                      ? "Local Guest"
                      : " Foreigner Guest"}
                  </div>
                  <div className="text-lg font-bold text-primary-400">
                    {plan?.guest_market == "local" ? plan?.currency : "USD"}
                    &nbsp;
                    {plan?.guest_market == "local"
                      ? plan?.default_price
                      : plan?.usd_display_price}
                    <span className="text-[10px] text-neutral-600 font-bold">
                      / Night
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div>
          {roomData?.display_status != "blocked" && (
            <>
              {roomData?.current_booking && (
                <div className="bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-4">
                  <div className=" flex items-center justify-around ">
                    <Avatar
                      src={
                        roomData?.current_booking?.primary_guest?.documents?.[0]
                          ?.file_url
                      }
                      size={60}
                    />
                    <div>
                      <div className=" text-xl font-heavy">
                        {roomData?.current_booking?.primary_guest?.name}
                      </div>
                      <br />
                      <div className=" font-medium">
                        {roomData?.current_booking?.reference}
                      </div>
                    </div>
                    <Tag
                      color={
                        roomData?.current_booking?.payment_status == "paid"
                          ? "success"
                          : "warning"
                      }
                      variant="solid"
                      className=" text-lg! capitalize!"
                    >
                      {roomData?.current_booking?.payment_status}
                    </Tag>
                  </div>
                  <Divider />
                  <div className=" flex justify-between items-center">
                    <div className=" flex items-center">
                      <HugeiconsIcon
                        icon={Calendar03Icon}
                        className=" text-success-600"
                        size={30}
                      />
                      <div className=" ml-2">
                        <div className=" font-medium">Check In</div>
                        <div className=" font-heavy text-xl">
                          {roomData?.current_booking?.check_in}
                        </div>
                      </div>
                    </div>
                    <div className=" flex items-center">
                      <HugeiconsIcon
                        icon={Calendar03Icon}
                        className=" text-error-600"
                        size={30}
                      />
                      <div className=" ml-2">
                        <div className=" font-medium">Check Out</div>
                        <div className=" font-heavy text-xl">
                          {roomData?.current_booking?.check_out}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className=" flex justify-between items-center">
                    <div className=" flex items-center">
                      <HugeiconsIcon icon={Moon02Icon} size={30} />
                      <div className=" ml-2">
                        <div className=" font-medium">Stay</div>
                        <div className=" font-heavy text-xl">
                          {roomData?.current_booking?.nights} Nights
                        </div>
                      </div>
                    </div>
                    <div className=" flex items-center">
                      <HugeiconsIcon icon={User02Icon} size={30} />
                      <div className=" ml-2">
                        <div className=" font-medium">Guest</div>
                        <div className=" font-heavy text-xl">
                          {`${roomData?.current_booking?.guest_count?.adults} Adult`}
                          &nbsp;&nbsp;
                          {`${roomData?.current_booking?.guest_count?.children} Child`}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        <div className="grid grid-cols-1 gap-5">
          <>
            {roomData?.current_block && (
              <>
                <div className="flex  bg-red-400/20 rounded-2xl p-5 border border-l-4 border-l-red-400 border-neutral-200/80 shadow-xs space-y-4">
                  <HugeiconsIcon
                    icon={CalendarBlock01Icon}
                    className=" text-red-600"
                  />
                  <div className="ml-5 text-red-600 font-blod">
                    <div>
                      Blocked&nbsp;
                      {moment(roomData?.current_block?.end_date).diff(
                        moment(roomData?.current_block?.start_date),
                        "days",
                      )}{" "}
                      nightsက
                    </div>
                    <div>
                      {roomData?.current_block?.start_date} -{" "}
                      {roomData?.current_block?.end_date}
                    </div>
                    <div>
                      {roomData?.current_block?.note
                        ? roomData?.current_block?.note
                        : "No Reason"}
                    </div>
                  </div>
                </div>
              </>
            )}
            {roomData?.upcoming_blocks?.length > 0 && (
              <>
                {roomData?.upcoming_blocks?.map((block, index) => {
                  return (
                    <div
                      key={index}
                      className="flex  bg-red-400/20 rounded-2xl p-5 border border-l-4 border-l-red-400 border-neutral-200/80 shadow-xs space-y-4"
                    >
                      <HugeiconsIcon
                        icon={CalendarBlock01Icon}
                        className=" text-red-600"
                      />
                      <div className="ml-5 text-red-600 font-blod">
                        <div>
                          Blocked&nbsp;
                          {moment(block?.end_date).diff(
                            moment(block?.start_date),
                            "days",
                          )}{" "}
                          nights
                        </div>
                        <div>
                          {block?.start_date} - {block?.end_date}
                        </div>
                        <div>{block?.note ? block?.note : "No Reason"}</div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
            {roomData?.next_reservations?.length > 0 && (
              <>
                {roomData?.next_reservations?.map((reserve) => {
                  return (
                    <div className="  bg-amber-400/20 rounded-2xl p-5 border border-l-4 border-l-amber-400 border-neutral-200/80 shadow-xs space-y-4">
                      <div
                        key={reserve?.id}
                        className=" flex items-center w-full"
                      >
                        <div className=" text-amber-600 font-blod flex justify-between w-full ">
                          <div>
                            <div>Dates &nbsp;</div>
                            <div className=" font-semibold">
                              {reserve?.check_in} - {reserve?.check_out}
                            </div>
                          </div>
                          <div>
                            <div>Night</div>
                            <div className=" font-semibold">
                              {reserve?.nights}{" "}
                            </div>
                          </div>
                          <div>
                            <div>Guests</div>
                            <div className=" font-semibold">
                              {reserve?.adults} Adults, {reserve?.children}{" "}
                              children
                            </div>
                          </div>
                        </div>
                      </div>
                      <Divider className=" my-2!" />
                      <div className=" flex justify-between">
                        <div className="  text-amber-600">
                          <div className="font-semibold">
                            {reserve?.primary_guest?.name}
                          </div>
                          <div className="">
                            {reserve?.primary_guest?.phone}
                          </div>
                        </div>
                        <div className="  text-amber-600 font-semibold">
                          {reserve?.formatted_grand_total}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </>
            )}
          </>

          <div className=" bg-white rounded-2xl p-5 border border-neutral-200/80 shadow-xs space-y-4">
            <div className="flex items-center space-x-2 font-medium text-neutral-800 font-bold text-xs uppercase tracking-wider">
              <HugeiconsIcon icon={DashboardSquare01Icon} />
              <span>Room Actions</span>
            </div>

            <div className="space-y-2 font-medium!">
              {roomData?.display_status === "out_of_service" ? (
                <div className="grid grid-cols-3 gap-3">
                  {renderRoomDetailsBtn()}
                  {renderRoomHistoryBtn()}
                  <button
                    onClick={() => {
                      setIsRepairModalOpen(true);
                    }}
                    className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border border-neutral-100 cursor-pointer"
                  >
                    <HugeiconsIcon
                      icon={Settings01Icon}
                      className="text-primary-400"
                    />
                    <span>Finish Repair</span>
                  </button>
                </div>
              ) : (
                <>
                  {(roomData?.display_status == "available" ||
                    roomData?.display_status == "reserved") && (
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => {
                          navigate(`/room/${id}/check-in/`);
                        }}
                        className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border-2 border-info-600 cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={CalendarCheckIn01Icon}
                          className="text-primary-400"
                        />
                        <span>Check In</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/room/${id}/reserve/`);
                        }}
                        className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border-2 border-orange-400 cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={CardExchange01Icon}
                          className="text-primary-400"
                        />
                        <span>Reserve</span>
                      </button>
                    </div>
                  )}

                  {roomData?.display_status == "occupied" && (
                    <div className="grid grid-cols-3 gap-3">
                      <button
                        onClick={() => {
                          setIsCheckOutModalOpen(true);
                        }}
                        className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border-2 border-info-600 cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={CalendarCheckOut01Icon}
                          className="text-primary-400"
                        />
                        <span>Check Out</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/room/${id}/reserve/`);
                        }}
                        disabled={true}
                        className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border-2 border-info-600 cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={CardExchange01Icon}
                          className="text-primary-400"
                        />
                        <span>Change Room</span>
                      </button>
                      <button
                        onClick={() => {
                          navigate(`/room/${id}/reserve/`);
                        }}
                        className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border-2 border-orange-400 cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={CardExchange01Icon}
                          className="text-primary-400"
                        />
                        <span>Reserve</span>
                      </button>
                    </div>
                  )}

                  {roomData?.display_status == "cleaning" && (
                    <button
                      onClick={() => {
                        setIsCleanModalOpen(true);
                      }}
                      className="w-full items-center justify-center p-3 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border-2 border-success-600 cursor-pointer"
                    >
                      <div className="flex justify-center">
                        <HugeiconsIcon
                          icon={CardExchange01Icon}
                          className="text-primary-400"
                        />
                      </div>
                      <span>Clean Room</span>
                    </button>
                  )}

                  <div className="grid grid-cols-4 gap-3">
                    {roomData?.current_block ||
                    roomData?.upcoming_blocks?.length > 0 ? (
                      <button
                        onClick={() => {
                          dispatch(
                            roomUnblock({
                              business_id: businessId,
                              id:
                                roomData?.block?.id ||
                                roomData?.upcoming_blocks?.[0]?.id,
                            }),
                          ).then((res) => {
                            if (_.endsWith(res.type, "fulfilled")) {
                              message.success("Room Unblock Successful.");
                              dispatch(
                                getOneRoom({
                                  business_id: businessId,
                                  date: moment().format("YYYY-MM-DD"),
                                  id: id,
                                }),
                              );
                            }
                          });
                        }}
                        className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border border-neutral-100 cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={SquareLockRemove01Icon}
                          className="text-primary-400"
                        />
                        <span>Unblock</span>
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setIsBlockModalOpen(true);
                        }}
                        className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border border-neutral-100 cursor-pointer"
                      >
                        <HugeiconsIcon
                          icon={SquareLockRemove01Icon}
                          className="text-primary-400"
                        />
                        <span>Block</span>
                      </button>
                    )}

                    {renderRoomDetailsBtn()}
                    {renderRoomHistoryBtn()}

                    {!roomData?.upcoming_blocks?.length &&
                      !roomData?.next_reservations?.length &&
                      !["blocked", "occupied", "reserved"].includes(
                        roomData?.display_status,
                      ) && (
                        <button
                          onClick={() => {
                            setIsModalOpen(true);
                          }}
                          className="flex flex-col items-center justify-center p-3 rounded-xl hover:bg-neutral-100 transition-colors text-neutral-700 font-bold text-xs border border-neutral-100 cursor-pointer"
                        >
                          <HugeiconsIcon
                            icon={Settings01Icon}
                            className="text-primary-400"
                          />
                          <span>OOS</span>
                        </button>
                      )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <OutOfServiceModal
        isModalOpen={isModalOpen}
        setIsModalOpen={setIsModalOpen}
        id={id}
      />
      <RoomBlockModal
        isBlockModalOpen={isBlockModalOpen}
        setIsBlockModalOpen={setIsBlockModalOpen}
        id={id}
      />
      <CheckOutModal
        isCheckOutModalOpen={isCheckOutModalOpen}
        setIsCheckOutModalOpen={setIsCheckOutModalOpen}
        data={roomData}
      />

      <CleanRoomModal
        isCleanModalOpen={isCleanModalOpen}
        setIsCleanModalOpen={setIsCleanModalOpen}
        data={roomData}
      />

      <FinishRepairModal
        isRepairModalOpen={isRepairModalOpen}
        setIsRepairModalOpen={setIsRepairModalOpen}
        data={roomData}
      />
    </div>
  );
};

export default RoomDetailsPage;
