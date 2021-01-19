import PropTypes from "prop-types";
import { Redirect, Route } from "react-router-dom";
import Swal from "sweetalert2";

const ProtectedRoute = ({ children, ...rest }) => {
  return (
    <Route
      {...rest}
      render={() => {
        if (rest.facebookStatus.status) {
          return children;
        } else {
          Swal.fire({ icon: "error", title: "尚未登錄會員" });
          return <Redirect to="/" />;
        }
      }}
    />
  );
};
ProtectedRoute.propTypes = {
  children: PropTypes.object.isRequired,
  facebookStatus: PropTypes.object.isRequired,
};

export default ProtectedRoute;
