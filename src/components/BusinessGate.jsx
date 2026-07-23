import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import PageLoading from "./PageLoading";
import {
  businessSelector,
  getOneBusiness,
  selectBusinessId,
  selectIsBusinessReady,
} from "../service/businessSlice";
import { BUSINESS_LABEL } from "../variables/constants";
import { base64UrlDecode } from "../utils/utils";

const BusinessGate = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isPending, hasError } = useSelector(businessSelector);
  const businessId = useSelector(selectBusinessId);
  const isBusinessReady = useSelector(selectIsBusinessReady);

  useEffect(() => {
    const storedBusinessId = localStorage.getItem(BUSINESS_LABEL);

    if (!storedBusinessId) {
      navigate("/select-business", { replace: true });
      return;
    }

    if (!isBusinessReady) {
      dispatch(getOneBusiness(base64UrlDecode(storedBusinessId)));
    }
  }, [dispatch, isBusinessReady, navigate]);

  if (!isBusinessReady) {
    if (hasError) {
      navigate("/select-business", { replace: true });
      return null;
    }

    return <PageLoading message="Loading business data..." />;
  }

  return <Outlet context={{ businessId }} />;
};

export default BusinessGate;
