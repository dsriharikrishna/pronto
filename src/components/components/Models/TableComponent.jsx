import React, { useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
  Typography,
  Box,
  Stack,
  IconButton,
  Tooltip,
  FormControl,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import { CalendarToday, ReportProblem } from "@mui/icons-material";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import { Bookmark, Copy } from "phosphor-react";
import { getDayName, formatDateTime } from "../../utils/helper";
import CustomDatePicker from "../Models/CustomDatePicker";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { orderDetails } from "../../redux/slicers/dashboardSlice";

const TableComponent = ({
  headers,
  paginatedOrders,
  handleSortRequest,
  orderBy,
  order,
  expandedRows,
  handleRowExpand,
  activeTab,
  childData,
  statusMap,
  handleStatusChange,
  handleSave,
  copied,
  handleCopyId,
  showDatePicker,
  selectedRowId,
  handleCalendarClick,
  setShowDatePicker,
  setSelectedRowId,
  handleDateChange,
  setIsBundleRecord,
  setSlotOne,
  renderIcons,
  statusOptions,
  statusOptionsRecurring,
  maidName,
  handleSaveMaid,
  maidNameMap,
  handleMaidNameChange,
  initialMaidMap,
  setExpandedRows,
  hubsDropdown,
  handleHubNameChange,
  errors,
  hubSelection,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // console.log(hubsDropdown, "hubsDropdown");
  const handleCallAPI = useCallback((id) => {
    console.log("Api Call happened and id is >>>", id);
    navigate(`/OrderDetails?id=${id}`);
  });

  return (
    <TableContainer
      elevation={1}
      sx={{
        maxHeight: "100%",
        overflowY: "auto",
      }}
    >
      <Table stickyHeader>
        <TableHead sx={{ bgcolor: "#f5f5f5" }}>
          <TableRow>
            {headers.map(({ id, label, sortable }) => (
              <TableCell
                key={id}
                sx={{
                  fontSize: "0.765rem",
                  fontWeight: 540,
                  height: "30px",
                  padding: "6px 16px",
                  borderBottom: "2px solid #ddd",
                  textAlign: "left",
                  lineHeight: "-0.5rem",
                }}
              >
                {sortable ? (
                  <TableSortLabel
                    active={orderBy === id}
                    direction={orderBy === id ? order : "asc"}
                    onClick={() => handleSortRequest(id)}
                  >
                    {label}
                  </TableSortLabel>
                ) : (
                  label
                )}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>

        <TableBody>
          {paginatedOrders.map((row, index) => {
            let currentStatus = statusMap[row.bookingId] || row.status;
            const selectedMaidId =
              maidNameMap[row.bookingId] || row.hubPartnerId;
            const isMaidPresent = maidName.some(
              (maid) => maid.id === selectedMaidId
            );
            const maidList = isMaidPresent
              ? maidName
              : [...maidName, { id: selectedMaidId, name: "Worker Assigned" }];

            const selectedHubId =
              hubSelection[row.bookingId] || row.hubId;
            const isHubPresent = hubsDropdown.some(
              (maid) => maid.id === selectedHubId
            );
            const HubList = isHubPresent
              ? hubsDropdown
              : [...hubsDropdown, { id: selectedHubId, name: "Hub Assigned" }];


            return (
              <React.Fragment key={row.bookingId + index}>
                <TableRow
                  sx={{
                    cursor: "pointer",
                    "&:hover": { bgcolor: "#f9f9f9" },
                    "& td": {
                      fontSize: "0.765rem",
                      fontWeight: 400,
                      padding: "10px",
                      borderBottom: "1px solid #e0e0e0",
                      textAlign: "left",
                    },
                  }}
                  key={row.bookingId + index}
                >
                  <TableCell>
                    {/* <Stack direction={'row'}>
                        <Typography sx={{ fontSize: {
                                                  xs: "0.7rem",
                                                  sm: "0.75rem",
                                                  md: "0.75rem",
                                                } }}>
                          {row.bookingId}
                        </Typography>
                        <Tooltip title={copied ? 'copied':'copy'} position='right'>
                          <Copy
                            size={24}
                            onClick={() => handleCopyId(row.bookingId)}
                          />
                        </Tooltip>
                      </Stack> */}

                    <Tooltip>
                      {row.type === "RECURRING" && activeTab === 5 && (
                        <Stack direction="row" alignItems="center">
                          <IconButton size="small">
                            {expandedRows[row.bookingId] ? (
                              <KeyboardArrowDownIcon
                                size={16}
                                onClick={() =>
                                  setExpandedRows((prev) => ({
                                    ...prev,
                                    [row.bookingId]: false,
                                  }))
                                }
                              />
                            ) : (
                              <KeyboardArrowRightIcon
                                size={16}
                                onClick={() => handleRowExpand(row.bookingId)}
                              />
                            )}
                          </IconButton>
                          <Typography fontSize="13px">
                            ({row?.childCount})
                          </Typography>
                        </Stack>
                      )}

                      <Stack direction="row" alignItems="center" spacing={1}>
                        {row?.paymentStatus === "failed" && (
                          <Tooltip title="Payment Failed" placement="top-start">
                            <IconButton
                              size="medium"
                              sx={{ color: "error.main" }}
                            >
                              <ReportProblem />
                            </IconButton>
                          </Tooltip>
                        )}
                        <Typography
                          // to="/OrderDetails"
                          // onClick={() => handleCallAPI(row.bookingId)}
                          style={{
                            // color: "#1976d2",
                            // textDecoration: "underline",
                            // cursor: "pointer",
                            fontSize: "0.765rem",
                          }}
                        >
                          {row.bookingId}
                        </Typography>
                        <Tooltip
                          title={copied ? "Copied!" : "Click to copy!"}
                          placement="top"
                        >
                          <IconButton
                            onClick={() => handleCopyId(row.bookingId)}
                            size="small"
                          >
                            <Copy size={14} />
                          </IconButton>
                        </Tooltip>
                      </Stack>

                      {/* <IconButton size="small" sx={{ ml: 1, fontSize: "0.987rem" }} onClick={() => copyToClipboard(row.bookingId)}>
                          <ContentCopyIcon fontSize="small" />
                        </IconButton> */}
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    {/* <Tooltip title={row.source}> */}
                    <Box display={"flex"} flexWrap={"wrap"} gap={0.5}>
                      {renderIcons(row)}
                    </Box>
                    {/* </Tooltip> */}
                  </TableCell>
                  <TableCell>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "2px",
                      }}
                    >
                      <Typography sx={{ fontSize: "0.765rem" }}>
                        {row.submitTime.split(",")[0]}
                      </Typography>
                      <Typography sx={{ fontSize: "0.765rem" }}>
                        {row.submitTime.split(",")[1]}
                      </Typography>
                      <Typography sx={{ fontSize: "0.765rem" }}>
                        {getDayName(row.submitTime)}
                      </Typography>
                    </Box>
                  </TableCell>
                  <TableCell>
                    {activeTab === 5 ? (
                      "--"
                    ) : (
                      <Box sx={{}}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 1,
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "2px",
                            }}
                          >
                            <Typography sx={{ fontSize: "0.765rem" }}>
                              {row.scheduledFor}
                            </Typography>
                            <Typography sx={{ fontSize: "0.765rem" }}>
                              {getDayName(row.scheduledFor)}
                            </Typography>
                          </Box>
                          <IconButton
                            size="medium"
                            onClick={() => {
                              handleCalendarClick(row.bookingId);
                              setIsBundleRecord(row?.bundleId ? true : false);
                              setSlotOne(
                                row.bundleId && row.reason === "catalog2"
                                  ? "two"
                                  : "one"
                              );
                            }}
                            sx={{
                              "& .MuiSvgIcon-root": {
                                fontSize: "0.765rem",
                              },
                            }}
                          >
                            <CalendarToday fontSize="small" />
                          </IconButton>
                        </Box>
                        {showDatePicker && selectedRowId === row.bookingId && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: 10,
                              zIndex: 1110,
                              backgroundColor: "white",
                              boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
                              borderRadius: "8px",
                              "& .react-datepicker": {
                                fontSize: "0.765rem",
                              },
                              "& .react-datepicker__header": {
                                fontSize: "0.765rem",
                              },
                              "& .react-datepicker__current-month": {
                                fontSize: "0.765rem",
                              },
                              "& .react-datepicker__day": {
                                fontSize: "0.765rem",
                              },
                              "& .react-datepicker__time-list-item": {
                                fontSize: "0.765rem",
                              },
                            }}
                          >
                            <CustomDatePicker
                              onDateChange={(date) =>
                                handleDateChange(date, row.bookingId, false)
                              }
                              onClose={() => {
                                setShowDatePicker(false);
                                setSelectedRowId(null);
                              }}
                            />
                          </Box>
                        )}
                      </Box>
                    )}
                  </TableCell>
                  <TableCell>
                    {/* <Tooltip title={row.name}> */}
                    <Box>{row.name}</Box>
                    <Box>{row.phone}</Box>
                    {/* </Tooltip> */}
                  </TableCell>
                  <TableCell>
                    <Tooltip title={row.address}>
                      <Box>{row.address}</Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={`BHK: ${row?.bhk || "-"}, Bathroom: ${row?.bathroom || "-"
                        }, Balcony: ${row?.balcony || "-"}`}
                      arrow
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          width: 100,
                          fontSize: {
                            xs: "0.7rem",
                            sm: "0.75rem",
                            md: "0.75rem",
                          },
                        }}
                      >
                        <Typography
                          component="p"
                          sx={{
                            fontSize: {
                              xs: "0.7rem",
                              sm: "0.75rem",
                              md: "0.75rem",
                            },
                          }}
                        >
                          <span>BHK:</span> {row?.bhk ?? "-"}
                        </Typography>
                        <Typography
                          component="p"
                          sx={{
                            fontSize: {
                              xs: "0.7rem",
                              sm: "0.75rem",
                              md: "0.75rem",
                            },
                          }}
                        >
                          <span>Bathroom:</span> {row?.bathroom ?? "-"}
                        </Typography>
                        <Typography
                          component="p"
                          sx={{
                            fontSize: {
                              xs: "0.7rem",
                              sm: "0.75rem",
                              md: "0.75rem",
                            },
                          }}
                        >
                          <span>Balcony:</span> {row?.balcony ?? "-"}
                        </Typography>
                      </Box>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    <Tooltip
                      title={
                        row.services
                          ? row.services
                            .split(",")
                            .map((s) => s.trim())
                            .slice(3)
                            .join(", ")
                          : ""
                      }
                      arrow
                    >
                      <Box
                        sx={{
                          fontSize: {
                            xs: "0.7rem",
                            sm: "0.75rem",
                            md: "0.8rem",
                          },
                        }}
                      >
                        {row.services
                          ? row.services
                            .split(",")
                            .map((s) => s.trim())
                            .slice(0, 3)
                            .join(", ")
                          : ""}
                      </Box>
                    </Tooltip>
                  </TableCell>

                  <TableCell>
                    {/* <Tooltip title={row.price}> */}
                    <Box>{row.price}</Box>
                    {/* </Tooltip> */}
                  </TableCell>
                  {/* <TableCell>
                      <Tooltip title={row.status}>
                        <Box>{row.status}</Box>
                      </Tooltip>
                    </TableCell> */}
                  <TableCell>
                    <Stack direction={"row"} gap={1}>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ borderBottom: "none" }}
                        error={!!errors?.maid}
                      >
                        <Select
                          value={selectedMaidId || ""}
                          //value={selectedMaidId || ""}
                          onChange={(e) => {
                            handleMaidNameChange(row.bookingId, e.target.value);
                            handleSaveMaid(
                              row.bookingId,
                              // maidNameMap[row.bookingId]
                              e.target.value
                            );
                          }}
                          displayEmpty
                          // renderValue={(selected) => {
                          //   if (!selected) return "Select Worker";
                          //   return getMaidNameById(selected) || "Select Worker";
                          // }}
                          sx={{
                            fontWeight: 300,
                            // height:'400px'
                            borderRadius: 1,
                            minWidth: 120,
                            fontSize: "13px",
                            "& .MuiSelect-select": {
                              padding: "4px 8px",
                            },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                maxHeight: 300, // Set your desired height here
                              },
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select Worker
                          </MenuItem>
                          {maidList?.map((maid) => (
                            <MenuItem
                              key={maid.id}
                              value={maid.id}
                              sx={{
                                //  height:'400px',
                                fontSize: {
                                  xs: "0.7rem",
                                  sm: "0.75rem",
                                  md: "0.75rem",
                                },
                              }}
                            >
                              {maid.name}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* <Button
                        size="small"
                        disabled={maidNameMap[row.bookingId] === initialMaidMap[row.bookingId]}
                        onClick={() =>
                          handleSaveMaid(
                            row.bookingId,
                            maidNameMap[row.bookingId]
                          )
                        }
                        sx={{
                          textTransform: "capitalize",
                          color: "#00b664",
                          padding: "0",
                          minWidth: 0,
                          minHeight: 0,
                          lineHeight: 1,
                          "& .MuiButton-startIcon": {
                            margin: 0,
                          },
                          "& .MuiButton-endIcon": {
                            margin: 0,
                          },
                        }}
                      >
                        <Tooltip title="Save!">
                          <Bookmark size={22} weight="fill" />
                        </Tooltip>
                      </Button> */}
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Stack direction={"row"} gap={1}>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ borderBottom: "none" }}
                        error={!!errors?.hub}
                      >
                        <Select
                          value={selectedHubId || ""}
                          onChange={(e) =>
                            handleHubNameChange(e, row.bookingId)
                          }
                          displayEmpty
                          sx={{
                            fontWeight: 300,
                            borderRadius: 1,
                            minWidth: 120,
                            fontSize: "13px",
                            "& .MuiSelect-select": {
                              padding: "4px 8px",
                            },
                          }}
                          MenuProps={{
                            PaperProps: {
                              sx: {
                                maxHeight: 300,
                              },
                            },
                          }}
                        >
                          <MenuItem value="" disabled>
                            Select Hub
                          </MenuItem>
                          {HubList?.map((hub) => (
                            <MenuItem
                              key={hub.id}
                              value={hub.id}
                              sx={{
                                fontSize: {
                                  xs: "0.7rem",
                                  sm: "0.75rem",
                                  md: "0.75rem",
                                },
                              }}
                            >
                              {hub.address}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Stack direction={"row"} gap={1}>
                      <FormControl
                        fullWidth
                        size="small"
                        sx={{ borderBottom: "none" }}
                      >
                        <Select
                          value={currentStatus}
                          onChange={(e) => {
                            const newStatus = e.target.value;
                            handleStatusChange(row.bookingId, newStatus);
                            handleSave(row.bookingId, newStatus, false);
                          }}
                          sx={{
                            fontWeight: 300,
                            borderRadius: 1,
                            fontSize: "13px",
                            // height: '32px',
                            "& .MuiSelect-select": {
                              padding: "4px 8px",
                            },
                          }}
                        >
                          {(activeTab === 5
                            ? statusOptionsRecurring
                            : statusOptions
                          )?.map((option) => (
                            <MenuItem
                              key={option.key}
                              value={option.key}
                              disabled={false}
                              sx={{
                                fontSize: {
                                  xs: "0.7rem",
                                  sm: "0.75rem",
                                  md: "0.75rem",
                                },
                              }}
                            >
                              {option.label}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>

                      {/* <Button
                        size="small"
                        disabled={currentStatus === row?.status}
                        onClick={() =>
                          handleSave(row.bookingId, currentStatus, false)
                        }
                        sx={{
                          textTransform: "capitalize",
                          color: "#00b664",

                          padding: "0",
                          minWidth: 0,
                          minHeight: 0,
                          lineHeight: 1,
                          "& .MuiButton-startIcon": {
                            margin: 0,
                          },
                          "& .MuiButton-endIcon": {
                            margin: 0,
                          },
                        }}
                      >
                        {currentStatus === row?.status ? (
                          <Bookmark size={22} weight="fill" />
                        ) : (
                          <Tooltip title="Save">
                            <Bookmark size={22} weight="fill" />
                          </Tooltip>
                        )}
                      
                      </Button> */}
                    </Stack>
                  </TableCell>
                </TableRow>
                {expandedRows[row.bookingId] && childData && (
                  <TableRow>
                    <TableCell colSpan={12} sx={{ bgcolor: "#f9f9f9" }}>
                      <Box sx={{ p: 1 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1 }}>
                          Child Orders
                        </Typography>
                        <Table size="small">
                          <TableBody>
                            {childData?.map((childRow) => {
                              // let orginalStatus = childRow.status;
                              let currentStatus =
                                statusMap[childRow.bookingId] ||
                                childRow.status;
                              // console.log(currentStatus ,orginalStatus)
                              const selectedMaidId =
                                maidNameMap[childRow.bookingId] ||
                                childRow.hubPartnerId;
                              const isMaidPresent = maidName.some(
                                (maid) => maid.id === selectedMaidId
                              );
                              const maidList = isMaidPresent
                                ? maidName
                                : [
                                  ...maidName,
                                  {
                                    id: selectedMaidId,
                                    name: "Worker Assigned",
                                  },
                                ];

                              const selectedHubId =
                                hubSelection[childRow.bookingId] || childRow.hubId;
                              const isHubPresent = hubsDropdown.some(
                                (maid) => maid.id === selectedHubId
                              );
                              const HubList = isHubPresent
                                ? hubsDropdown
                                : [...hubsDropdown, { id: selectedHubId, name: "Hub Assigned" }];


                              return (
                                <TableRow
                                  key={childRow.bookingId}
                                  sx={{
                                    "& td": {
                                      fontSize: "0.765rem",
                                      fontWeight: 400,
                                      padding: "1px 6px",
                                      borderBottom: "1px solid #e0e0e0",
                                      textAlign: "left",
                                    },
                                  }}
                                >
                                  <TableCell>
                                    <Tooltip>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          cursor: "pointer",
                                          width: 170,
                                        }}
                                      // onClick={() =>
                                      //   copyToClipboard(
                                      //     childRow.bookingId
                                      //   )
                                      // }
                                      >
                                        <Stack direction={"row"}>
                                          {childRow.bookingId}
                                          <Tooltip
                                            title={
                                              copied
                                                ? "Copied!"
                                                : "Click to copy!"
                                            }
                                            position="top"
                                          >
                                            <Copy
                                              size={20}
                                              onClick={() =>
                                                handleCopyId(childRow.bookingId)
                                              }
                                            />
                                          </Tooltip>
                                        </Stack>
                                        {/* <IconButton size="small" sx={{ ml: 1 }}>
                                                <ContentCopyIcon fontSize="small" />
                                              </IconButton> */}
                                      </Box>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell>
                                    <Box
                                      width={100}
                                      display={"flex"}
                                      flexWrap={"wrap"}
                                      gap={0.5}
                                    >
                                      {renderIcons(childRow)}
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Box
                                      sx={{
                                        display: "flex",
                                        flexDirection: "column",
                                        gap: "2px",
                                        width: 100,
                                      }}
                                    >
                                      <Typography sx={{ fontSize: "0.765rem" }}>
                                        {
                                          formatDateTime(
                                            childRow.submitTime
                                          ).split(",")[0]
                                        }
                                      </Typography>
                                      <Typography sx={{ fontSize: "0.765rem" }}>
                                        {
                                          formatDateTime(
                                            childRow.submitTime
                                          ).split(",")[1]
                                        }
                                      </Typography>
                                      <Typography sx={{ fontSize: "0.765rem" }}>
                                        {getDayName(
                                          formatDateTime(childRow.submitTime)
                                        )}
                                      </Typography>
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Box>
                                      <Box
                                        sx={{
                                          display: "flex",
                                          alignItems: "center",
                                          gap: 1,
                                        }}
                                      >
                                        <Box
                                          sx={{
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "2px",
                                            width: 100,
                                          }}
                                        >
                                          <Typography
                                            sx={{ fontSize: "0.765rem" }}
                                          >
                                            {
                                              formatDateTime(
                                                childRow.scheduledFor
                                              ).split(",")[0]
                                            }
                                          </Typography>
                                          <Typography
                                            sx={{ fontSize: "0.765rem" }}
                                          >
                                            {
                                              formatDateTime(
                                                childRow.scheduledFor
                                              ).split(",")[1]
                                            }
                                          </Typography>
                                          <Typography
                                            sx={{ fontSize: "0.765rem" }}
                                          >
                                            {getDayName(
                                              formatDateTime(
                                                childRow.scheduledFor
                                              )
                                            )}
                                          </Typography>
                                        </Box>

                                        <IconButton
                                          size="medium"
                                          onClick={() => {
                                            handleCalendarClick(
                                              childRow.bookingId
                                            );
                                            setIsBundleRecord(
                                              row?.bundleId ? true : false
                                            );
                                            setSlotOne(
                                              row.bundleId &&
                                                row.reason === "catalog2"
                                                ? "two"
                                                : "one"
                                            );
                                          }}
                                          sx={{
                                            "& .MuiSvgIcon-root": {
                                              fontSize: "0.765rem",
                                            },
                                          }}
                                        >
                                          <CalendarToday fontSize="small" />
                                        </IconButton>
                                      </Box>
                                      {showDatePicker &&
                                        selectedRowId ===
                                        childRow.bookingId && (
                                          <Box
                                            sx={{
                                              position: "absolute",
                                              top: 10,
                                              zIndex: 1110,
                                              backgroundColor: "white",
                                              boxShadow:
                                                "0px 4px 10px rgba(0,0,0,0.1)",
                                              borderRadius: "8px",
                                              "& .react-datepicker": {
                                                fontSize: "0.765rem",
                                              },
                                              "& .react-datepicker__header": {
                                                fontSize: "0.765rem",
                                              },
                                              "& .react-datepicker__current-month":
                                              {
                                                fontSize: "0.765rem",
                                              },
                                              "& .react-datepicker__day": {
                                                fontSize: "0.765rem",
                                              },
                                              "& .react-datepicker__time-list-item":
                                              {
                                                fontSize: "0.765rem",
                                              },
                                            }}
                                          >
                                            <CustomDatePicker
                                              onDateChange={(date) =>
                                                handleDateChange(
                                                  date,
                                                  childRow.bookingId,
                                                  true
                                                )
                                              }
                                              onClose={() => {
                                                setShowDatePicker(false);
                                                setSelectedRowId(null);
                                              }}
                                            />
                                          </Box>
                                        )}
                                    </Box>
                                  </TableCell>
                                  <TableCell>
                                    <Box>{childRow.name}</Box>
                                    <Box>{childRow.phone}</Box>
                                  </TableCell>
                                  <TableCell>
                                    <Tooltip title={childRow.address}>
                                      <Box>{childRow.address}</Box>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell>
                                    <Tooltip
                                      title={`BHK: ${childRow?.bhk || "-"
                                        }, Bathroom: ${childRow?.bathroom || "-"
                                        }, Balcony: ${childRow?.balcony || "-"}`}
                                      arrow
                                    >
                                      <Box
                                        sx={{
                                          display: "flex",
                                          flexDirection: "column",
                                          gap: "2px",
                                          width: 100,
                                          fontSize: {
                                            xs: "0.7rem",
                                            sm: "0.75rem",
                                            md: "0.75rem",
                                          },
                                        }}
                                      >
                                        <Typography
                                          component="p"
                                          sx={{
                                            fontSize: {
                                              xs: "0.7rem",
                                              sm: "0.75rem",
                                              md: "0.75rem",
                                            },
                                          }}
                                        >
                                          <span>BHK:</span>{" "}
                                          {childRow?.bhk ?? "-"}
                                        </Typography>
                                        <Typography
                                          component="p"
                                          sx={{
                                            fontSize: {
                                              xs: "0.7rem",
                                              sm: "0.75rem",
                                              md: "0.75rem",
                                            },
                                          }}
                                        >
                                          <span>Bathroom:</span>{" "}
                                          {childRow?.bathroom ?? "-"}
                                        </Typography>
                                        <Typography
                                          component="p"
                                          sx={{
                                            fontSize: {
                                              xs: "0.7rem",
                                              sm: "0.75rem",
                                              md: "0.75rem",
                                            },
                                          }}
                                        >
                                          <span>Balcony:</span>{" "}
                                          {childRow?.balcony ?? "-"}
                                        </Typography>
                                      </Box>
                                    </Tooltip>
                                  </TableCell>
                                  <TableCell>
                                    {childRow.services
                                      ? childRow.services
                                        .split(",")
                                        .map((s) => s.trim())
                                        .slice(0, 3)
                                        .join(", ")
                                      : ""}
                                  </TableCell>
                                  <TableCell>{childRow.price}</TableCell>
                                  {/* <TableCell>{childRow.status}</TableCell> */}
                                  <TableCell>
                                    <Stack direction={"row"} gap={1}>
                                      <FormControl
                                        fullWidth
                                        size="small"
                                        borderBottom="none"
                                      >
                                        <Select
                                          //value={maidNameMap[childRow.bookingId] || childRow.hubPartnerId || ""}
                                          value={selectedMaidId || ""}
                                          onChange={(e) => {
                                            handleMaidNameChange(
                                              childRow.bookingId,
                                              e.target.value
                                            );
                                            handleSaveMaid(
                                              childRow.bookingId,
                                              e.target.value
                                            );
                                          }}
                                          displayEmpty
                                          sx={{
                                            fontWeight: 300,
                                            borderRadius: 1,
                                            minWidth: 120,
                                            fontSize: "13px",
                                            "& .MuiSelect-select": {
                                              padding: "4px 8px",
                                            },
                                          }}
                                          MenuProps={{
                                            PaperProps: {
                                              sx: {
                                                maxHeight: 300,
                                              },
                                            },
                                          }}
                                        >
                                          <MenuItem value="" disabled>
                                            Select Worker
                                          </MenuItem>
                                          {maidList?.map((maid) => (
                                            <MenuItem
                                              key={maid.id}
                                              value={maid.id}
                                              sx={{
                                                fontSize: {
                                                  xs: "0.7rem",
                                                  sm: "0.75rem",
                                                  md: "0.75rem",
                                                },
                                              }}
                                            >
                                              {maid.name}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>

                                      {/* <Button
                                        size="small"
                                        disabled={maidNameMap[childRow.bookingId] === initialMaidMap[childRow.bookingId]}
                                        onClick={() =>
                                          handleSaveMaid(childRow.bookingId, maidNameMap[childRow.bookingId])
                                        }
                                        sx={{
                                          textTransform: "capitalize",
                                          color: "#00b664",
                                          padding: "0",
                                          minWidth: 0,
                                          minHeight: 0,
                                          lineHeight: 1,
                                          "& .MuiButton-startIcon": {
                                            margin: 0,
                                          },
                                          "& .MuiButton-endIcon": {
                                            margin: 0,
                                          },
                                        }}
                                      >
                                        <Tooltip title="Save!">
                                          <Bookmark size={22} weight="fill" />
                                        </Tooltip>
                                      </Button> */}
                                    </Stack>
                                  </TableCell>
                                  <TableCell>
                                    <Stack direction={"row"} gap={1}>
                                      <FormControl
                                        fullWidth
                                        size="small"
                                        sx={{ borderBottom: "none" }}
                                        error={!!errors?.hub}
                                      >
                                        <Select
                                          value={
                                            selectedHubId || ""
                                          }
                                          onChange={(e) =>
                                            handleHubNameChange(
                                              e,
                                              childRow.bookingId
                                            )
                                          }
                                          displayEmpty
                                          sx={{
                                            fontWeight: 300,
                                            borderRadius: 1,
                                            minWidth: 120,
                                            fontSize: "13px",
                                            "& .MuiSelect-select": {
                                              padding: "4px 8px",
                                            },
                                          }}
                                          MenuProps={{
                                            PaperProps: {
                                              sx: {
                                                maxHeight: 300,
                                              },
                                            },
                                          }}
                                        >
                                          <MenuItem value="" disabled>
                                            Select Hub
                                          </MenuItem>
                                          {HubList?.map((hub) => (
                                            <MenuItem
                                              key={hub.id}
                                              value={hub.id}
                                              sx={{
                                                fontSize: {
                                                  xs: "0.7rem",
                                                  sm: "0.75rem",
                                                  md: "0.75rem",
                                                },
                                              }}
                                            >
                                              {hub.address}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    </Stack>
                                  </TableCell>
                                  <TableCell>
                                    <Stack
                                      direction="row"
                                      gap={1}
                                      alignItems="center"
                                      width={200}
                                    >
                                      <FormControl size="small" minWidth={160}>
                                        <Select
                                          value={currentStatus}
                                          onChange={(e) => {
                                            const newStatus = e.target.value;
                                            handleStatusChange(
                                              childRow.bookingId,
                                              newStatus
                                            );
                                            handleSave(
                                              childRow?.bookingId,
                                              newStatus,
                                              true
                                            );
                                          }}
                                          sx={{
                                            fontWeight: 300,
                                            borderRadius: 1,
                                            fontSize: "13px",
                                            "& .MuiSelect-select": {
                                              padding: "4px 8px",
                                            },
                                          }}
                                        >
                                          {statusOptions.map((option) => (
                                            <MenuItem
                                              key={option.key}
                                              value={option.key}
                                              sx={{
                                                fontSize: {
                                                  xs: "0.7rem",
                                                  sm: "0.75rem",
                                                  md: "0.75rem",
                                                },
                                              }}
                                            >
                                              {option.label}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>

                                      {/* <Button
                                        size="small"
                                        disabled={
                                          currentStatus === childRow.status
                                        }
                                        onClick={() =>
                                          handleSave(
                                            childRow?.bookingId,
                                            currentStatus,
                                            true
                                          )
                                        }
                                        sx={{
                                          textTransform: "capitalize",
                                          fontWeight: 300,
                                          color: "#00b664",
                                          padding: "0",
                                          minWidth: 0,
                                          minHeight: 0,
                                          lineHeight: 1,
                                          "& .MuiButton-startIcon": {
                                            margin: 0,
                                          },
                                          "& .MuiButton-endIcon": {
                                            margin: 0,
                                          },
                                        }}
                                      >
                                        {currentStatus === childRow.status ? (
                                          <Bookmark size={22} weight="fill" />
                                        ) : (
                                          <Bookmark size={22} weight="fill" />
                                        )}
                                      </Button> */}
                                    </Stack>
                                  </TableCell>
                                </TableRow>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </Box>
                    </TableCell>
                  </TableRow>
                )}
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default TableComponent;
