import axios, { Method } from "axios";
import { useState } from "react";

interface RequestAttrs {
  url: string;
  method: Method;
  data: any;
  onSuccess: (data: any) => void;
}

function useRequest(params: RequestAttrs) {
  const { url, method, data, onSuccess } = params;

  const [errors, setErrors] = useState<React.ReactNode | null>(null);

  const doRequest = async () => {
    try {
      setErrors(null);
      const response = await axios.request({ method, url, data });

      onSuccess(response.data);

      return response.data;
    } catch (err) {
      setErrors(
        <div className="alert alert-danger">
          <h4>Oooops...</h4>
          <ul className="my-0">
            {err.response.data.errors.map((err) => (
              <li key={err.message}>{err.message}</li>
            ))}
          </ul>
        </div>
      );
    }
  };

  return { doRequest, errors };
}

export default useRequest;
