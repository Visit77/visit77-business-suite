import React, { useEffect, useState } from "react";
import { Form, Input, Select, Button, Upload, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import { roomBuildTypesSelector } from "../../service/roomBuildTypesSlice";
import { roomStandardSelector } from "../../service/roomStandardSlice";
import { useParams } from "react-router-dom";
import { bulkDeleteImage } from "../../service/roomTypeSlice";
import _ from "lodash";

const { TextArea } = Input;

const RoomStep1Form = ({ fileList, setFileList, isEdit }) => {
  const { id } = useParams();
  const { data: buildTypes, isPending } = useSelector(roomBuildTypesSelector);
  const { data: standards, isPending: isStandardPending } =
    useSelector(roomStandardSelector);

  const buildTypesOption = buildTypes?.map((type) => {
    return {
      label: type?.name,
      value: type?.id,
    };
  });

  const standardOption = standards?.map((standard) => {
    return {
      label: standard?.name,
      value: standard?.id,
    };
  });
  const dispatch = useDispatch();

  const handleRemove = (file) => {
    if (isEdit || file.id || file.url) {
      const submitData = new FormData();
      submitData.append(`image_ids[]`, file.uid);
      dispatch(
        bulkDeleteImage({
          id,
          formData: submitData,
        }),
      ).then((res) => {
        if (_.endsWith(res.type, "fulfilled")) {
          message.success("Image remove Successful.");
        }
      });
    }
    return true;
  };

  return (
    <>
      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
        <h2 className="text-xs font-bold text-teal-500 uppercase tracking-wide">
          BASIC INFO
        </h2>

        <Form.Item
          label={
            <span className="text-xs text-slate-600 font-medium">
              Room Type Name *
            </span>
          }
          name="name"
          rules={[{ required: true, message: "Required" }]}
          className="mb-3"
        >
          <Input
            className="rounded-lg h-10 text-xs bg-slate-50/50"
            placeholder=" Room Type Name"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-xs text-slate-600 font-medium">
              Room Standard *
            </span>
          }
          name="room_standard_id"
          rules={[{ required: true, message: "Required" }]}
          className="mb-3"
        >
          <Select
            className="h-10 text-xs"
            options={standardOption}
            placeholder="Select Room Standard"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-xs text-slate-600 font-medium">
              Room Build Type *
            </span>
          }
          name="room_build_type_id"
          rules={[{ required: true, message: "Required" }]}
          className="mb-3"
        >
          <Select
            className="h-10 text-xs"
            options={buildTypesOption}
            placeholder="Select Room Build Type"
          />
        </Form.Item>

        <Form.Item
          label={
            <span className="text-xs text-slate-600 font-medium">
              Room Description
            </span>
          }
          name="description"
          className="mb-0"
        >
          <TextArea
            rows={3}
            className="rounded-lg text-xs bg-slate-50/50"
            placeholder="Description"
          />
        </Form.Item>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
        <h2 className="text-xs font-bold text-teal-500 uppercase tracking-wide">
          OCCUPANCY LIMITS
        </h2>
        <div className="grid grid-cols-2 gap-3">
          <Form.Item
            label={
              <span className="text-xs text-slate-600 font-medium">
                Maximum Adults *
              </span>
            }
            name="max_adults"
            rules={[{ required: true, message: "Required" }]}
            className="mb-0"
          >
            <Select className="h-10 text-xs">
              {[1, 2, 3, 4, 5].map((num) => (
                <Select.Option key={num} value={String(num)}>
                  {num}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs text-slate-600 font-medium">
                Maximum Children *
              </span>
            }
            name="max_children"
            rules={[{ required: true, message: "Required" }]}
            className="mb-0"
          >
            <Select className="h-10 text-xs">
              {[0, 1, 2, 3, 5, 10].map((num) => (
                <Select.Option key={num} value={String(num)}>
                  {num}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-4 shadow-xs border border-slate-100 space-y-3">
        <h2 className="text-xs font-bold text-teal-500 uppercase tracking-wide">
          TYPICAL ROOM SIZE (RANGE)
        </h2>
        <div className="grid grid-cols-3 gap-2">
          <Form.Item
            label={
              <span className="text-xs text-slate-600 font-medium">From</span>
            }
            name="room_area_from"
            className="mb-0"
          >
            <Input
              className="rounded-lg h-10 text-xs bg-slate-50/50"
              placeholder="from"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs text-slate-600 font-medium">To</span>
            }
            name="room_area_to"
            className="mb-0"
          >
            <Input
              className="rounded-lg h-10 text-xs bg-slate-50/50"
              placeholder="to"
            />
          </Form.Item>

          <Form.Item
            label={
              <span className="text-xs text-slate-600 font-medium">
                Area Unit
              </span>
            }
            name="area_unit"
            className="mb-0"
          >
            <Select className="h-10 text-xs">
              <Option value="sqft">sqft</Option>
              <Option value="sqm">sqm</Option>
            </Select>
          </Form.Item>
        </div>
      </div>

      <Upload
        multiple
        listType="picture"
        fileList={fileList}
        beforeUpload={() => false}
        onChange={({ fileList }) => setFileList(fileList)}
        accept="image/*"
        className="w-full block"
        onRemove={handleRemove} // <= Image delete လုပ်ရင် console ထုတ်ပေးရန် ထည့်သွင်းထားသည်
      >
        <Button
          type="primary"
          icon={<PlusOutlined />}
          className="w-full h-11 bg-blue-600 hover:bg-blue-700 rounded-xl font-semibold text-xs flex items-center justify-center space-x-1"
        >
          Upload Images
        </Button>
      </Upload>
    </>
  );
};

export default RoomStep1Form;
