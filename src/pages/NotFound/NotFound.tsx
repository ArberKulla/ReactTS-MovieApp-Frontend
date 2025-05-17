import type { FunctionComponent } from "react";
import { Result } from "antd";
import { TbError404 } from "react-icons/tb";
import { useLocation } from "react-router-dom";

const NotFound: FunctionComponent = () => {
  const location = useLocation();
  return (
    <Result
      subTitle={
        <div style={{ fontWeight: "600", fontSize: "20px", color: "#333333" }}>
          Sorry, the page you visited does not exist.
          <p>
            The requested URL <strong>{location.pathname}</strong> was not
            found.
          </p>
        </div>
      }
      icon={<TbError404 style={{ fontSize: "150px" }} />}
    />
  );
};

export default NotFound;
