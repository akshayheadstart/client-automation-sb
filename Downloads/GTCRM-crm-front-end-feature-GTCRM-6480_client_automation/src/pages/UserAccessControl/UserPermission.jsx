/* eslint-disable react-hooks/exhaustive-deps */
import { Box, Button, Card, Fab } from "@mui/material";
import React, { useContext, useEffect } from "react";
import { useCallback, useState } from "react";
import Tree from "react-d3-tree";
import AddOutlinedIcon from "@mui/icons-material/AddOutlined";
import RemoveIcon from "@mui/icons-material/Remove";
import "../../styles/userPermission.css";
import "../../styles/sharedStyles.css";
import UserRoleListItem from "../../components/ui/User-Access-Conreoll/UserRoleListItem";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import LeefLottieAnimationLoader from "../../components/shared/Loader/LeefLottieAnimationLoader";
import { DashboradDataContext } from "../../store/contexts/DashboardDataContext";
// import { permissionNodeData } from "../../constants/permissionNodeData";
import UserPermissionTutorial from "../../components/ui/User-Access-Conreoll/UserPermissionTutorial";
import Error500Animation from "../../components/shared/ErrorAnimation/Error500Animation";
import { ErrorFallback } from "../../hooks/ErrorFallback";
import { handleSomethingWentWrong } from "../../utils/handleSomethingWentWrong";
import { ApiCallHeaderAndBody } from "../../hooks/ApiCallHeaderAndBody";
import UserMenuListItem from "../../components/ui/User-Access-Conreoll/UserMenuListItem";
import { useSelector } from "react-redux";
import { useGetFeatureListQuery } from "../../Redux/Slices/applicationDataApiSlice";
import useToasterHook from "../../hooks/useToasterHook";
import { handleInternalServerError } from "../../utils/handleInternalServerError";
import { LayoutSettingContext } from "../../store/contexts/LayoutSetting";
import { customFetch } from "../StudentTotalQueries/helperFunction";

const UserPermission = () => {
  const collegeId = useSelector(
    (state) => state.authentication.currentUserInitialCollege?.id
  );
  const { setApiResponseChangeMessage, apiResponseChangeMessage } =
    useContext(DashboradDataContext);
  const token = Cookies.get("jwtTokenCredentialsAccessToken");
  const navigate = useNavigate();
  const HEIGHT = 80;
  const WIDTH = 150;
  const Y_OFFSET = 80;
  const Y_CLEARANCE = 150;
  const CONTAINER_STYLES = {
    width: "100%",
    height: "100vh",
  };
  const permissionTreeNodeColor = [
    { violet: "#9251ac" },
    { pink: "#f6a4ec" },
    { skyBlue: "#87bbfe" },
    { blue: "#555ac0" },
    { mint: "#24b47e" },
    { emerald: "#aff1b6" },
  ];

  const [permissionTreeNodeData, setPermissionTreeNodeData] = useState({});
  const [allPermission, setAllPermission] = useState([]);
  const [loading, setLoading] = useState(false);
  const [permissionUpdated, setPermissionUpdated] = useState(false);
  const [openTutorialDialog, setOpenTutorialDialog] = React.useState(false);

  //something went wrong state
  const [
    somethingWentWrongInUserPermission,
    setSomethingWentWrongInUserPermission,
  ] = useState(false);
  const [hideUserPermission, setHideUserPermission] = useState(false);
  const [updateApiInternalServerError, setUpdateApiInternalServerError] =
    useState(false);

  const updatePermissionData = async (permissionData) => {
    const permissionNodeTree = [];
    permissionData.forEach((currentItem, index) => {
      permissionNodeTree.push({
        name: currentItem?.user_type?.split("_")?.join(" "),

        children: [
          {
            name: "Menu",

            children: [
              {
                name: "Permissions",
                id: 1,
                permissionName: `${currentItem?.user_type
                  ?.split("_")
                  ?.join("")}Menu`,
                menu: index,
                userType: currentItem?.user_type,
              },
            ],
          },
          {
            name: "User Role",

            children: [
              {
                name: "Permissions",
                id: 2,
                permissionName: `${currentItem?.user_type
                  ?.split("_")
                  ?.join("")}Role`,
                role: index,
                userType: currentItem?.user_type,
              },
            ],
          },
        ],
      });
    });

    return { name: "Permission", children: [...permissionNodeTree] };
  };

  useEffect(() => {
    setLoading(true);
    const callAPI = async () => {
      customFetch(
        `${
          import.meta.env.VITE_API_BASE_URL
        }/user/get_all_menu_and_permission/${
          collegeId ? "?college_id=" + collegeId : ""
        }`,
        ApiCallHeaderAndBody(token, "GET")
      )
        .then((res) => res.json())
        .then(async (result) => {
          if (result.detail === "Could not validate credentials") {
            window.location.reload();
          } else if (result.data) {
            setLoading(false);
            try {
              if (Array.isArray(result.data)) {
                setAllPermission(result.data);

                let PermissionNodeData = await updatePermissionData(
                  result.data
                );
                setPermissionTreeNodeData(PermissionNodeData);
              } else {
                throw new Error(
                  "get_all_menu_and_permission API response has changed"
                );
              }
            } catch (error) {
              setApiResponseChangeMessage(error);
              handleSomethingWentWrong(
                setSomethingWentWrongInUserPermission,
                setHideUserPermission,
                10000
              );
            }
          } else if (result.detail) {
            setLoading(false);
          }
        })
        .catch((error) => {
          setLoading(false);
          navigate("/page500");
        })
        .finally(() => setLoading(false));
    };
    callAPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissionUpdated]);

  const useCenteredTree = (defaultTranslate = { x: 0, y: 0 }) => {
    const [translate, setTranslate] = useState(defaultTranslate);
    const containerRef = useCallback((containerElem) => {
      if (containerElem !== null) {
        const { width } = containerElem.getBoundingClientRect();
        setTranslate({ x: width / 2, y: Y_OFFSET });
      }
    }, []);
    return [translate, containerRef];
  };
  const [translate, containerRef] = useCenteredTree();
  const [featuresListData, setFeaturesListData] = useState({});
  const pushNotification = useToasterHook();
  const [internalServerError, setInternalServerError] = useState(false);
  const [somethingWentWrong, setSomethingWentWrong] = useState(false);
  const {
    data: featureList,
    isSuccess,
    isFetching,
    error,
    isError,
  } = useGetFeatureListQuery({ collegeId });
  useEffect(() => {
    try {
      if (isSuccess) {
        if (typeof featureList?.features === "object") {
          setFeaturesListData(featureList?.features);
        } else {
          throw new Error("Inbound API response has changed");
        }
      }
      if (isError) {
        if (error?.data?.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (error?.data?.detail) {
          pushNotification("error", error?.data?.detail);
        }
        if (error?.status === 500) {
          handleInternalServerError(setInternalServerError);
        }
      }
    } catch (error) {
      setApiResponseChangeMessage(error);
      handleSomethingWentWrong(setSomethingWentWrong);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isError, isSuccess, featureList]);

  const handleSetAllPermissions = useCallback(
    (newPermissions, node) => {
      setAllPermission((prevState) => {
        prevState[node?.menu].menus = newPermissions;
        return {
          ...prevState,
        };
      });
    },
    [setAllPermission]
  );

  const saveUserPermissionsBulk = () => {
    const permissionPayload =
      Object.keys(allPermission)
        ?.map((key) => {
          return allPermission[key];
        })
        ?.map((item) => {
          item.menus.features = {
            features: {
              menu: item?.user_type === "super_admin" ? true : false,
            },
          };
          return item;
        }) || [];
    setLoading(true);
    customFetch(
      `${
        import.meta.env.VITE_API_BASE_URL
      }/super_admin/update_users_menu_permission/${
        collegeId ? "?college_id=" + collegeId : ""
      }`,
      ApiCallHeaderAndBody(token, "PUT", JSON.stringify(permissionPayload))
    )
      .then((res) => res.json())
      .then((result) => {
        setPermissionUpdated(!permissionUpdated);
        if (result.detail === "Could not validate credentials") {
          window.location.reload();
        } else if (result.detail) {
          setLoading(false);
          pushNotification("error", result.detail);
        } else {
          try {
            pushNotification("success", "Successfully Updated");
            setLoading(false);
            window.location.reload();
          } catch (error) {
            setApiResponseChangeMessage(error);
            handleSomethingWentWrong(
              setSomethingWentWrongInUserPermission,
              "",
              5000
            );
          }
        }
      })
      .catch((error) => {
        setLoading(false);
        handleInternalServerError(setUpdateApiInternalServerError, "", 5000);
      })
      .finally(() => setLoading(false));
  };

  const renderForeignObjectNode = ({ nodeDatum, toggleNode }) => {
    return (
      <g>
        {/* `foreignObject` requires width & height to be explicitly set. */}
        <foreignObject
          id="permission-box"
          style={{
            textTransform: "capitalize",
            boxShadow:
              nodeDatum.id === 1 || nodeDatum.id === 2
                ? "rgba(0, 0, 0, 0.24) 0px 3px 8px"
                : "rgba(17, 17, 26, 0.05) 0px 1px 0px, rgba(17, 17, 26, 0.1) 0px 0px 8px",
            background:
              nodeDatum.name === "Permission"
                ? permissionTreeNodeColor[5]?.emerald
                : nodeDatum.id === 1 || nodeDatum.id === 2
                ? "white"
                : permissionTreeNodeColor[5]?.emerald,
            borderRadius: "8px",
            width:
              nodeDatum.id === 1 || nodeDatum.id === 2
                ? "330px"
                : nodeDatum.name === "Permission"
                ? "200px"
                : WIDTH.toString() + "px",
            height:
              nodeDatum.id === 1
                ? "500px"
                : nodeDatum.id === 2
                ? "475px"
                : nodeDatum.name === "Permission"
                ? "90px"
                : HEIGHT.toString() + "px",
            x:
              nodeDatum.id === 1 || nodeDatum.id === 2
                ? -170
                : nodeDatum.name === "Permission"
                ? -100
                : WIDTH / -2,
            y: HEIGHT / -2,
          }}
        >
          <Box
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent:
                nodeDatum.name === "Permissions"
                  ? "flex-start"
                  : "space-between",
              height: "100%",
            }}
          >
            <p
              style={{
                padding: "5px",
                textAlign: "center",
                fontWeight: "bold",
                fontSize:
                  nodeDatum.name === "Permissions"
                    ? "23px"
                    : nodeDatum.name === "Permission"
                    ? "25px"
                    : "",
              }}
            >
              {nodeDatum.name}
            </p>
            <Box id="list-item-permission">
              {nodeDatum.id === 1 && (
                <UserMenuListItem
                  permissionUpdated={permissionUpdated}
                  setPermissionUpdated={setPermissionUpdated}
                  loading={loading}
                  setLoading={setLoading}
                  allPermission={allPermission}
                  nodeDatum={nodeDatum}
                  setUpdateApiInternalServerError={
                    setUpdateApiInternalServerError
                  }
                  setSomethingWentWrongInUserPermission={
                    setSomethingWentWrongInUserPermission
                  }
                  featuresListData={featuresListData}
                  setAllPermission={handleSetAllPermissions}
                  saveUserPermissionsBulk={saveUserPermissionsBulk}
                ></UserMenuListItem>
              )}
            </Box>
            <Box id="list-item-permission">
              {nodeDatum.id === 2 && (
                <UserRoleListItem
                  allPermission={allPermission}
                  nodeDatum={nodeDatum}
                  permissionUpdated={permissionUpdated}
                  setPermissionUpdated={setPermissionUpdated}
                  loading={loading}
                  setLoading={setLoading}
                  setUpdateApiInternalServerError={
                    setUpdateApiInternalServerError
                  }
                  setSomethingWentWrongInUserPermission={
                    setSomethingWentWrongInUserPermission
                  }
                  internalServerError={internalServerError}
                  somethingWentWrong={somethingWentWrong}
                  isFetching={isFetching}
                ></UserRoleListItem>
              )}
            </Box>

            {nodeDatum.children && (
              <button
                style={{ width: "100%", height: "23px", color: "#41ffff" }}
                onClick={toggleNode}
              >
                {nodeDatum.__rd3t.collapsed ? (
                  <AddOutlinedIcon style={{ color: "#41ffff" }} />
                ) : (
                  <RemoveIcon />
                )}
              </button>
            )}
          </Box>
        </foreignObject>
      </g>
    );
  };
  const { setHeadTitle, headTitle } = useContext(LayoutSettingContext);
  useEffect(() => {
    setHeadTitle("Change User Permissions");
    document.title = "Change User Permissions";
  }, [headTitle]);
  return (
    <Box
      component="main"
      sx={{ flexGrow: 1 }}
      className="custom-component-container-box"
    >
      <Card elevation={16} sx={{ px: 3, pb: 3 }}>
        {somethingWentWrongInUserPermission || updateApiInternalServerError ? (
          <>
            {somethingWentWrongInUserPermission && (
              <ErrorFallback
                error={apiResponseChangeMessage}
                resetErrorBoundary={() => window.location.reload()}
              />
            )}
            {updateApiInternalServerError && (
              <Error500Animation height={400} width={400}></Error500Animation>
            )}
          </>
        ) : (
          <Box
            sx={{ visibility: hideUserPermission ? "hidden" : "visible" }}
            style={CONTAINER_STYLES}
            ref={containerRef}
          >
            {loading ? (
              <Card id="lottie-card-loader">
                {" "}
                <LeefLottieAnimationLoader
                  height={150}
                  width={200}
                ></LeefLottieAnimationLoader>{" "}
              </Card>
            ) : (
              <Tree
                isTransitioning={true}
                shouldCollapseNeighborNodes={true}
                zoomable={false}
                zoom={1}
                data={permissionTreeNodeData}
                collapsible={true}
                leafNodeClassName="node__leaf"
                initialDepth={1}
                translate={translate}
                allowForeignObjects
                pathFunc="step"
                orientation="vertical"
                nodeSvgShape={{ shape: "none" }}
                nodeSize={{ x: 200, y: Y_CLEARANCE }}
                useCollapseData={true}
                renderCustomNodeElement={(rd3tProps) =>
                  renderForeignObjectNode({ ...rd3tProps })
                }
              />
            )}
          </Box>
        )}
      </Card>

      {!loading && (
        <Fab size="large" id="tutorials-button" variant="extended">
          <Button
            onClick={() => setOpenTutorialDialog(true)}
            size="small"
            className="animated-button"
          >
            {/* extra spans are here for animated design.*/}
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            Tutorial
          </Button>
        </Fab>
      )}

      <UserPermissionTutorial
        openTutorialDialog={openTutorialDialog}
        setOpenTutorialDialog={setOpenTutorialDialog}
      ></UserPermissionTutorial>
    </Box>
  );
};

export default UserPermission;
