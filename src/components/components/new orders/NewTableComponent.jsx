import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import { CalendarToday, ReportProblem, AccessTime } from "@mui/icons-material";
import { Copy, Info } from "phosphor-react";
import { getDayName, formatDateTime } from "../../utils/helper";
import { shouldShowUrgency, getMinutesUntilBooking } from "../../../utils/notificationConfig";
import CustomDatePicker from "../Models/CustomDatePicker";
import NewDropdownsDialog from "./NewDropdownsDialog.jsx";
import MoreVertIcon from "@mui/icons-material/MoreVert";

const NewTableComponent = ({
  headers,
  paginatedOrders,
  handleSortRequest,
  orderBy,
  order,
  expandedRows,
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
  hubSelection,
  handleHubNameChange,
  errors,
  bookingDropdownType,
  handleViewDetails,
  setStartDate,
  startDate,
  handleReSechuleDateChange,
  dropdownDialogOpen,
  dropdownDialogRow,
  setDropdownDialogOpen,
  setDropdownDialogRow,
  setParentBookingPartner,
  parentBookingPartner,
  handleParentBookingPartnerChange,
  secondaryPartnerMap,
  handleSecondaryPartnerChange,
  handleRemoveSecondaryPartner,
  showSecondaryMaidSection,
  handleToggleSecondaryMaid,
  maidOperationLoading,
}) => {
  if (paginatedOrders.length === 0) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Typography>No data found.</Typography>
      </Box>
    );
  }

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
            {headers.map(({ id, label, sortable, width }) => (
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
                  width: width || "auto",
                  minWidth: width || "auto",
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
            const currentStatus = statusMap[row.bookingId] || row.bookingStatus;

            const selectedPreferedMaidId =
              maidNameMap[row.bookingId] || row.preferredPartnerId;

            const isMaidPresentPreferred = maidName.some(
              (maid) => maid.id === selectedPreferedMaidId
            );

            const maidListPreferred = isMaidPresentPreferred
              ? maidName
              : [
                  ...maidName,
                  {
                    id: selectedPreferedMaidId,
                    name: "Preferred Worker Assigned",
                  },
                ];

            const selectedMaidId =
              maidNameMap[row.bookingId] || row.preferredPartnerId;

            const selectedHubId = hubSelection[row.bookingId] || row.hubId;

            // Prepare worker list
            const isMaidPresent = maidName.some(
              (maid) => maid.id === selectedMaidId
            );
            const maidList = isMaidPresent
              ? maidName
              : [...maidName, { id: selectedMaidId, name: "Worker Assigned" }];

            // Prepare hub list
            const isHubPresent = hubsDropdown.some(
              (hub) => hub.id === selectedHubId
            );
            const hubList = isHubPresent
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
                    <Tooltip>
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
                        <Typography style={{ fontSize: "0.765rem" }}>
                          {row.bookingId}
                        </Typography>
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "2px",
                          }}
                        >
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
                          <Tooltip
                            title={"Click to View Order Details!"}
                            placement="top"
                          >
                            <IconButton
                              onClick={() => handleViewDetails(row)}
                              size="small"
                            >
                              <Info size={14} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Stack>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Box display={"flex"} flexWrap={"nowrap"} gap={0.5}>
                      {renderIcons(row)}
                    </Box>
                  </TableCell>
                  <TableCell
                    sx={{
                      width: "160px",
                      minWidth: "160px",
                      maxWidth: "160px",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 1,
                        minWidth: 0,
                      }}
                    >
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                          flex: 1,
                          minWidth: 0,
                        }}
                      >
                        <Typography sx={{ fontSize: "0.765rem" }}>
                          {formatDateTime(row.bookingScheduledAt).split(
                            ","
                          )[0] || ""}
                        </Typography>
                        <Typography sx={{ fontSize: "0.765rem" }}>
                          {formatDateTime(row.bookingScheduledAt).split(
                            ","
                          )[1] || ""}
                        </Typography>
                        <Typography sx={{ fontSize: "0.765rem" }}>
                          {getDayName(
                            formatDateTime(row.bookingScheduledAt)
                          ) || ""}
                        </Typography>
                      </Box>
                      
                      {/* Simple urgency indicator for bookings < 20 minutes - only on upcoming tab */}
                      {activeTab === 0 && shouldShowUrgency(row.bookingScheduledAt) && (() => {
                        const minutesUntil = getMinutesUntilBooking(row.bookingScheduledAt);
                        return (
                          <Tooltip title="Booking starts soon - needs assignment">
                            <Typography
                              sx={{
                                color: '#ff6b35',
                                fontSize: '0.8rem',
                                fontWeight: 'bold',
                                backgroundColor: '#fff3e0',
                                padding: '3px 8px',
                                borderRadius: '4px',
                                border: '1px solid #ff6b35',
                                animation: 'urgencyPulse 2s ease-in-out infinite',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                                alignSelf: 'flex-start',
                                '@keyframes urgencyPulse': {
                                  '0%': {
                                    opacity: 1,
                                    transform: 'scale(1)',
                                    boxShadow: '0 0 0 0 rgba(255, 107, 53, 0.4)',
                                  },
                                  '50%': {
                                    opacity: 0.8,
                                    transform: 'scale(1.05)',
                                    boxShadow: '0 0 0 4px rgba(255, 107, 53, 0.2)',
                                  },
                                  '100%': {
                                    opacity: 1,
                                    transform: 'scale(1)',
                                    boxShadow: '0 0 0 0 rgba(255, 107, 53, 0.4)',
                                  },
                                },
                              }}
                            >
                              {minutesUntil} min
                            </Typography>
                          </Tooltip>
                        );
                      })()}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                      spacing={1}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          fontWeight="normal"
                          color="text.primary"
                          sx={{
                            fontSize: {
                              xs: "0.7rem",
                              sm: "0.75rem",
                              md: "0.75rem",
                            },
                          }}
                        >
                          {row.customerName || "N/A"}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{
                            fontSize: {
                              xs: "0.7rem",
                              sm: "0.75rem",
                              md: "0.75rem",
                            },
                          }}
                        >
                          {row.customerPhoneNumber || "N/A"}
                        </Typography>
                      </Box>

                      <Tooltip
                        title={copied ? "Copied!" : "Click to copy!"}
                        placement="top"
                      >
                        <IconButton
                          onClick={() =>
                            handleCopyId(
                              `Name: ${row.customerName || "N/A"}\nPhone: ${
                                row.customerPhoneNumber || "N/A"
                              }`
                            )
                          }
                          size="small"
                        >
                          <Copy size={16} />
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Stack spacing={1}>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Box>
                          {/* Delivery Address Tooltip */}
                          <Tooltip
                            title={
                              copied ? "Copied!" : row?.deliveryAddress || "N/A"
                            }
                            arrow
                          >
                            <Typography
                              variant="body2"
                              noWrap
                              sx={{
                                maxWidth: 200,
                                fontSize: {
                                  xs: "0.7rem",
                                  sm: "0.75rem",
                                  md: "0.75rem",
                                },
                              }}
                            >
                              {row?.deliveryAddress || "N/A"}
                            </Typography>
                          </Tooltip>

                          {/* Clickable Google Maps Link */}
                          <Typography
                            component="a"
                            href={
                              row?.coordinates?.latitude &&
                              row?.coordinates?.longitude
                                ? `https://www.google.com/maps?q=${row.coordinates.latitude},${row.coordinates.longitude}`
                                : "#"
                            }
                            target="_blank"
                            rel="noopener noreferrer"
                            variant="body2"
                            color="#0000EE"
                            noWrap
                            sx={{
                              display: "block",
                              maxWidth: 200,
                              fontSize: {
                                xs: "0.7rem",
                                sm: "0.75rem",
                                md: "0.75rem",
                              },
                              textDecoration: "none",
                              mt: 0.5,
                            }}
                          >
                            {row?.coordinates?.latitude &&
                            row?.coordinates?.longitude
                              ? "Open in Google Maps"
                              : "Location: N/A"}
                          </Typography>
                        </Box>

                        {/* Copy Button with Dynamic Tooltip */}
                        {(row?.deliveryAddress ||
                          (row?.coordinates?.latitude &&
                            row?.coordinates?.longitude)) && (
                          <Tooltip
                            title={
                              copied
                                ? "Copied!"
                                : "Click to copy address and MapLink"
                            }
                            arrow
                          >
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => {
                                  const address = row?.deliveryAddress || "";
                                  const link =
                                    row?.coordinates?.latitude &&
                                    row?.coordinates?.longitude
                                      ? `https://www.google.com/maps?q=${row.coordinates.latitude},${row.coordinates.longitude}`
                                      : "";
                                  const formatted = `Address: ${address}\nMapLink: ${link}`;
                                  handleCopyId(formatted.trim());
                                }}
                              >
                                <Copy size={14} />
                              </IconButton>
                            </span>
                          </Tooltip>
                        )}
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Tooltip
                      title={`BHK: ${row?.bhk || "-"}, Bathroom: ${
                        row?.bathroom || "-"
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
                        Array.isArray(row.services)
                          ? row.services.slice(3).join(", ")
                          : row.services
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
                        {Array.isArray(row.services)
                          ? row.services.slice(0, 3).join(", ")
                          : row.services
                          ? row.services
                              .split(",")
                              .map((s) => s.trim())
                              .slice(0, 3)
                              .join(", ")
                          : "N/A"}
                      </Box>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Box>
                      <Typography
                        sx={{
                          fontSize: "0.765rem",
                          textTransform: "capitalize",
                          fontWeight: 500,
                        }}
                      >
                        {row?.partnerName || "N/A"}
                      </Typography>
                      {row?.secondaryPartnerName && (
                        <Typography
                          sx={{
                            fontSize: "0.7rem",
                            textTransform: "capitalize",
                            color: "#666",
                            mt: 0.3,
                            fontStyle: "italic",
                          }}
                        >
                          Secondary: {row.secondaryPartnerName}
                        </Typography>
                      )}
                    </Box>
                  </TableCell>

                  <TableCell>
                    <Box>
                      {row?.hubName === "null - null"
                        ? "N/A"
                        : row?.hubName || "N/A"}
                    </Box>
                  </TableCell>

                  <TableCell>
                    {statusOptions.map((option) => {
                      if (option.key === row?.bookingStatus) {
                        return <Box key={option.key}>{option.label}</Box>;
                      }
                      return null;
                    })}
                  </TableCell>

                  <TableCell>
                    <Box>{row?.totalAfterDiscount || "N/A"}</Box>
                  </TableCell>

                  <TableCell>
                    <Box
                      sx={{
                        width: "100%",
                        height: "100%",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Tooltip title="">
                        <IconButton
                          onClick={() => {
                            setDropdownDialogOpen(true);
                            setDropdownDialogRow(row);
                          }}
                        >
                          <MoreVertIcon />
                        </IconButton>
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            );
          })}
        </TableBody>
      </Table>
      {dropdownDialogRow && (
        <NewDropdownsDialog
          open={dropdownDialogOpen}
          onClose={() => {
            setDropdownDialogOpen(false), setShowDatePicker(null);
          }}
          row={dropdownDialogRow}
          setShowDatePicker={setShowDatePicker}
          showDatePicker={showDatePicker}
          selectedMaidId={
            dropdownDialogRow.bookingId in maidNameMap 
              ? maidNameMap[dropdownDialogRow.bookingId]
              : dropdownDialogRow?.partnerId 
          }
          maidList={maidName}
          handleMaidNameChange={handleMaidNameChange}
          handleSaveMaid={handleSaveMaid}
          hubSelection={hubSelection}
          handleHubNameChange={handleHubNameChange}
          hubsDropdown={hubsDropdown}
          errors={errors}
          currentStatus={
            dropdownDialogRow.bookingId in statusMap 
              ? statusMap[dropdownDialogRow.bookingId]
              : dropdownDialogRow.bookingStatus
          }
          selectedHubId={
            dropdownDialogRow.bookingId in hubSelection 
              ? hubSelection[dropdownDialogRow.bookingId] 
              : dropdownDialogRow.hubId
          }
          HubList={hubsDropdown}
          handleStatusChange={handleStatusChange}
          handleSave={handleSave}
          statusOptions={statusOptions}
          setStartDate={setStartDate}
          startDate={startDate}
          handleReSechuleDateChange={handleReSechuleDateChange}
          parentBookingPartner={parentBookingPartner}
          setParentBookingPartner={setParentBookingPartner}
          handleParentBookingPartnerChange={handleParentBookingPartnerChange}
          selectedPreferredMaidId={
            dropdownDialogRow.parentBookingId in parentBookingPartner 
              ? parentBookingPartner[dropdownDialogRow.parentBookingId]
              : dropdownDialogRow.preferredPartnerId
          }
          secondaryPartnerMap={secondaryPartnerMap}
          handleSecondaryPartnerChange={handleSecondaryPartnerChange}
          selectedSecondaryPartnerId={
            dropdownDialogRow.bookingId in secondaryPartnerMap 
              ? secondaryPartnerMap[dropdownDialogRow.bookingId]
              : dropdownDialogRow.secondaryPartnerId
          }
          handleRemoveSecondaryPartner={handleRemoveSecondaryPartner}
          showSecondaryMaidSection={showSecondaryMaidSection}
          handleToggleSecondaryMaid={handleToggleSecondaryMaid}
          maidOperationLoading={maidOperationLoading}
        />
      )}
    </TableContainer>
  );
};

export default NewTableComponent;
