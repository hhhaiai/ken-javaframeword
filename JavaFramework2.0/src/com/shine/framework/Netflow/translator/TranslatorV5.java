/**
 * <p>Description:raw netflow translator for v5</p>
 * <p>Company:shine</p>
 * @author afu
 * @project sourceflow2.0
 * @date 20080429
 */

package com.shine.Netflow.translator;

import java.util.ArrayList;
import java.util.List;

import com.shine.Netflow.model.RawNetFlow;
import com.shine.Netflow.utils.NetFlowUtil;
import com.shine.framework.core.util.DateUtil;

public class TranslatorV5 extends Translator {

	private static final int V5_HEADER_SIZE = 24;
	private static final int V5_TEMPLATE[][] = new int[][] {
			{ V5_HEADER_SIZE + 0, 4 }, // 0.src_ip
			{ V5_HEADER_SIZE + 4, 4 }, // 1.dst_ip
			{ V5_HEADER_SIZE + 8, 4 }, // 2.nexthop
			{ V5_HEADER_SIZE + 12, 2 }, // 3.in_if
			{ V5_HEADER_SIZE + 14, 2 }, // 4.out_if
			{ V5_HEADER_SIZE + 16, 4 }, // 5.packets
			{ V5_HEADER_SIZE + 20, 4 }, // 6.bytes
			{ V5_HEADER_SIZE + 24, 4 }, // 7.
			{ V5_HEADER_SIZE + 28, 4 }, // 8.
			{ V5_HEADER_SIZE + 32, 2 }, // 9.src_port
			{ V5_HEADER_SIZE + 34, 2 }, // 10.dst_port
			{ V5_HEADER_SIZE + 36, 1 }, // 11.
			{ V5_HEADER_SIZE + 37, 1 }, // 12.
			{ V5_HEADER_SIZE + 38, 1 }, // 13.protocol
			{ V5_HEADER_SIZE + 39, 1 }, // 14.
			{ V5_HEADER_SIZE + 40, 2 }, // 15.
			{ V5_HEADER_SIZE + 42, 2 }, // 16.
			{ V5_HEADER_SIZE + 44, 1 }, // 17.
			{ V5_HEADER_SIZE + 45, 1 }, // 18.
			{ V5_HEADER_SIZE + 46, 2 } }; // 19.

	public List<RawNetFlow> translate(final int rid, final byte[] buffer) {

		RawNetFlow flow = new RawNetFlow();

		flow.setRouterId(rid);
		flow.setSrcIP(NetFlowUtil.toLongNumber(buffer, V5_TEMPLATE[0][0],
				V5_TEMPLATE[0][1]));
		flow.setDstIP(NetFlowUtil.toLongNumber(buffer, V5_TEMPLATE[1][0],
				V5_TEMPLATE[1][1]));

		flow.setSrcPort(NetFlowUtil.toIntNumber(buffer, V5_TEMPLATE[9][0],
				V5_TEMPLATE[9][1]));
		flow.setDstPort(NetFlowUtil.toIntNumber(buffer, V5_TEMPLATE[10][0],
				V5_TEMPLATE[10][1]));

		flow.setInIf(NetFlowUtil.toIntNumber(buffer, V5_TEMPLATE[3][0],
				V5_TEMPLATE[3][1]));
		flow.setOutIf(NetFlowUtil.toIntNumber(buffer, V5_TEMPLATE[4][0],
				V5_TEMPLATE[4][1]));

		flow.setBytes(NetFlowUtil.toIntNumber(buffer, V5_TEMPLATE[6][0],
				V5_TEMPLATE[6][1]));

		flow.setProtocol(NetFlowUtil.toIntNumber(buffer, V5_TEMPLATE[13][0],
				V5_TEMPLATE[13][1]));

		flow.setLogTime(DateUtil.getCurrentTime());

		List<RawNetFlow> raws = new ArrayList<RawNetFlow>();
		raws.add(flow);

		return raws;
	}
}

//
// *-------*-----------*----------------------------------------------------------*
// | Bytes | Contents | Description |
// *-------*-----------*----------------------------------------------------------*
// | 0-3 | srcaddr | Source IP address |
// *-------*-----------*----------------------------------------------------------*
// | 4-7 | dstaddr | Destination IP address |
// *-------*-----------*----------------------------------------------------------*
// | 8-11 | nexthop | IP address of next hop router |
// *-------*-----------*----------------------------------------------------------*
// | 12-13 | input | Interface index (ifindex) of input interface |
// *-------*-----------*----------------------------------------------------------*
// | 14-15 | output | Interface index (ifindex) of output interface |
// *-------*-----------*----------------------------------------------------------*
// | 16-19 | dPkts | Packets in the flow |
// *-------*-----------*----------------------------------------------------------*
// | 20-23 | dOctets | Total number of Layer 3 bytes in the packets of the flow
// |
// *-------*-----------*----------------------------------------------------------*
// | 24-27 | First | SysUptime at start of flow |
// *-------*-----------*----------------------------------------------------------*
// | 28-31 | Last | SysUptime at the time the last packet of the flow was |
// | | | received |
// *-------*-----------*----------------------------------------------------------*
// | 32-33 | srcport | TCP/UDP source port number or equivalent |
// *-------*-----------*----------------------------------------------------------*
// | 34-35 | dstport | TCP/UDP destination port number or equivalent |
// *-------*-----------*----------------------------------------------------------*
// | 36 | pad1 | Unused (zero) bytes |
// *-------*-----------*----------------------------------------------------------*
// | 37 | tcp_flags | Cumulative OR of TCP flags |
// *-------*-----------*----------------------------------------------------------*
// | 38 | protocol | IP protocol type (for example, TCP = 6; UDP = 17) |
// *-------*-----------*----------------------------------------------------------*
// | 39 | tos | IP type of service (ToS) |
// *-------*-----------*----------------------------------------------------------*
// | 40-41 | src_as | Autonomous system number of the source, either origin or |
// | | | peer |
// *-------*-----------*----------------------------------------------------------*
// | 42-43 | dst_as | Autonomous system number of the destination, either |
// | | | origin or peer |
// *-------*-----------*----------------------------------------------------------*
// | 44 | src_mask | Source address prefix mask bits |
// *-------*-----------*----------------------------------------------------------*
// | 45 | dst_mask | Destination address prefix mask bits |
// *-------*-----------*----------------------------------------------------------*
// | 46-47 | pad2 | Unused (zero) bytes |
// *-------*-----------*----------------------------------------------------------*

// Bytes Contents Description

// 0-1 version NetFlow export format version number
// 2-3 count Number of flows exported in this packet (1-30)
// 4-7 SysUptime Current time in milliseconds since the export device booted
// 8-11 unix_secs Current count of seconds since 0000 UTC 1970
// 12-15 unix_nsecs Residual nanoseconds since 0000 UTC 1970
// 16-19 flow_sequence Sequence counter of total flows seen
// 20 engine_type Type of flow-switching engine
// 21 engine_id Slot number of the flow-switching engine
// 22-23 reserved Unused (zero) bytes

// Table B-4 Version 5 Flow Record Format
// Bytes Contents Description
// 0-3 srcaddr Source IP address
// 4-7 dstaddr Destination IP address
// 8-11 nexthop IP address of next hop router
// 12-13 input SNMP index of input interface
// 14-15 output SNMP index of output interface
// 16-19 dPkts Packets in the flow
// 20-23 dOctets Total number of Layer 3 bytes in the packets of the flow
// 24-27 First SysUptime at start of flow
// 28-31 Last SysUptime at the time the last packet of the flow was received
// 32-33 srcport TCP/UDP source port number or equivalent
// 34-35 dstport TCP/UDP destination port number or equivalent
// 36 pad1 Unused (zero) bytes
// 37 tcp_flags Cumulative OR of TCP flags
// 38 prot IP protocol type (for example, TCP = 6; UDP = 17)
// 39 tos IP type of service (ToS)
// 40-41 src_as Autonomous system number of the source, either origin or peer
// 42-43 dst_as Autonomous system number of the destination, either origin or
// peer
// 44 src_mask Source address prefix mask bits
// 45 dst_mask Destination address prefix mask bits
// 46-47 pad2 Unused (zero) bytes

