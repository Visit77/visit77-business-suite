import React from "react";

import { Divider, Table } from "antd";

import { useSelector } from "react-redux";
import { otaRevenueSelector } from "../../service/otaRevenueSlice";
import PageLoading from "../PageLoading";

const OTAAvailableAndHeldFund = ({ type }) => {
  const { isPending, hasError, data } = useSelector(otaRevenueSelector);

  if (isPending) {
    return <PageLoading />;
  }
  return (
    <>
      {type == "held-funds" ? (
        <div className="bg-neutral-200 p-4 mb-4 flex justify-between items-center">
          <div className="">Total Held Fund:</div>
          <div className=" text-primary-700">
            {data?.currency}&nbsp;
            {data?.total_held_fund}
          </div>
        </div>
      ) : (
        <div className="bg-neutral-50 p-4 mb-4">
          <div className=" bg-neutral-200 p-3 mb-3">
            Period Covered: {data?.period_from} - {data?.period_to}
          </div>
          <div>
            <div className=" flex justify-between items-center text-sm py-2">
              <div className=" text-neutral-600">Booking Collection</div>
              <div>
                {data?.currency}&nbsp;
                {data?.booking_collection}
              </div>
            </div>

            <div className=" flex justify-between items-center text-sm py-2">
              <div className=" text-neutral-600">Release of Held Funds</div>
              <div>
                {data?.currency}&nbsp;
                {data?.released_held_funds}
              </div>
            </div>
            <div className=" flex justify-between items-center text-sm py-2">
              <div className=" text-neutral-600">
                Tax (Excluded from commission)
              </div>
              <div>
                {data?.currency}&nbsp;
                {data?.tax_excluded_from_commission}
              </div>
            </div>
            <div className=" flex justify-between items-center text-sm py-2">
              <div className=" text-neutral-600">Commission</div>
              <div>
                {data?.currency}&nbsp;
                {data?.commission !== undefined
                  ? Number(data.commission) % 1 >= 0.5
                    ? Math.ceil(Number(data.commission))
                    : Math.floor(Number(data.commission))
                  : ""}
              </div>
            </div>
            <div className=" flex justify-between items-center text-sm pt-2">
              <div className=" text-neutral-600">Refund</div>
              <div>
                {data?.currency}&nbsp;
                {data?.refund}
              </div>
            </div>
            <Divider />
            <div className=" flex justify-between items-center text-sm pb-2">
              <div className=" text-neutral-600">Available</div>
              <div>
                {data?.currency}&nbsp;
                {data?.available !== undefined
                  ? Number(data.available) % 1 >= 0.5
                    ? Math.ceil(Number(data.available))
                    : Math.floor(Number(data.available))
                  : ""}
              </div>
            </div>
          </div>
        </div>
      )}
      {data?.grouped_items?.map((group, groupIdx) => {
        if (!group?.date_groups || group.date_groups.length === 0) return null;

        return (
          <div key={groupIdx} className="mb-6">
            <h2 className="text-base font-bold text-blue-600 mb-3">
              {group?.label}
            </h2>

            {group?.date_groups?.map((dateGroup, dateIdx) => {
              const dataSource = dateGroup?.items || [];

              const columns = [
                {
                  title: "TIME",
                  dataIndex: "effective_time",
                  key: "effective_time",
                  width: 90,
                  render: (text) => (
                    <span className="text-xs font-normal text-gray-700">
                      {text}
                    </span>
                  ),
                },
                {
                  title: "BOOKING ID",
                  dataIndex: "booking_code",
                  key: "booking_code",
                  width: 140,
                  render: (text) => (
                    <span className="text-xs font-medium text-gray-800">
                      {text}
                    </span>
                  ),
                },
                {
                  title: (
                    <div className="leading-tight">
                      <div>CHECK-IN</div>
                      <div>CHECK-OUT</div>
                    </div>
                  ),
                  key: "check_dates",
                  width: 120,
                  render: (_, record) => (
                    <div className="text-xs text-gray-700 leading-snug">
                      <div>{record.check_in}</div>
                      <div>{record.check_out}</div>
                    </div>
                  ),
                },
                {
                  title: (
                    <div className="text-right leading-tight">
                      <div>AMOUNT</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        {data?.currency}
                      </div>
                    </div>
                  ),
                  dataIndex: "amount",
                  key: "amount",
                  align: "right",
                  width: 90,
                  render: (text) => (
                    <span className="text-xs font-medium text-gray-800">
                      {text?.toLocaleString()}
                    </span>
                  ),
                },
                {
                  title: (
                    <div className="text-right leading-tight">
                      <div>REFUND</div>
                      <div className="text-[10px] text-gray-500 font-normal">
                        {data?.currency}
                      </div>
                    </div>
                  ),
                  dataIndex: "refund_amount",
                  key: "refund_amount",
                  align: "right",
                  width: 90,
                  render: (text) => (
                    <span className="text-xs font-medium text-gray-800">
                      {text ? text.toLocaleString() : "-"}
                    </span>
                  ),
                },
              ];

              return (
                <div key={dateIdx} className="mb-4 overflow-x-auto">
                  <div className="bg-neutral-200 text-neutral-800 font-semibold px-3 py-1.5 text-xs rounded-t">
                    {dateGroup?.date}
                  </div>

                  <Table
                    columns={columns}
                    dataSource={dataSource}
                    rowKey="id"
                    pagination={false}
                    size="small"
                    className="border-b border-gray-100"
                    components={{
                      header: {
                        cell: (props) => (
                          <th
                            {...props}
                            className="bg-neutral-100 text-gray-600 font-semibold text-[11px] py-2 px-3 border-none"
                          />
                        ),
                      },
                    }}
                  />
                </div>
              );
            })}
          </div>
        );
      })}
    </>
  );
};

export default OTAAvailableAndHeldFund;
