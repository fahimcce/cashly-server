import mongoose from "mongoose";
import { TErrorSources } from "../interfaces/error";

const handleValidationError = (err: mongoose.Error.ValidationError) => {
  const errorSource: TErrorSources = Object.values(err.errors).map(
    (val: mongoose.Error.ValidatorError | mongoose.Error.CastError) => {
      return {
        path: val?.path,
        message: val?.message,
      };
    }
  );
  const statusCode = 5000;
  return {
    statusCode,
    message: "Validation Error",
    errorSource,
  };
};
export default handleValidationError;
