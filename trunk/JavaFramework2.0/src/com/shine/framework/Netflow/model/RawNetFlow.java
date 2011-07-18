/**
 * <p>Description:raw netflow object</p>
 * <p>Company:shine</p>
 * @author afu
 * @project sourceflow2.0
 * @date 20080428
 */

package com.shine.Netflow.model;

import com.shine.Netflow.utils.NetFlowUtil;

public class RawNetFlow {
	private static final String subSql = "(router_id,src_ip,src_port,dst_ip,dst_port,in_if,out_if,protocol,bytes,log_time)values(";

	private int routerId;
	private long srcIP;
	private long dstIP;
	private int srcPort;
	private int dstPort;
	private int inIf;
	private int outIf;
	private int bytes;
	private int protocol;
	private String logTime;

	public RawNetFlow() {
		routerId = 1;
		bytes = 0;
	}

	public int getRouterId() {
		return routerId;
	}

	public void setRouterId(int routerId) {
		this.routerId = routerId;
	}

	public long getSrcIP() {
		return srcIP;
	}

	public void setSrcIP(long srcIP) {
		this.srcIP = srcIP;
	}

	public long getDstIP() {
		return dstIP;
	}

	public void setDstIP(long dstIP) {
		this.dstIP = dstIP;
	}

	public int getSrcPort() {
		return srcPort;
	}

	public void setSrcPort(int srcPort) {
		this.srcPort = srcPort;
	}

	public int getDstPort() {
		return dstPort;
	}

	public void setDstPort(int dstPort) {
		this.dstPort = dstPort;
	}

	public int getInIf() {
		return inIf;
	}

	public void setInIf(int inIf) {
		this.inIf = inIf;
	}

	public int getOutIf() {
		return outIf;
	}

	public void setOutIf(int outIf) {
		this.outIf = outIf;
	}

	public int getBytes() {
		return bytes;
	}

	public void setBytes(int bytes) {
		this.bytes = bytes;
	}

	public int getProtocol() {
		return protocol;
	}

	public void setProtocol(int protocol) {
		this.protocol = protocol;
	}

	public String getLogTime() {
		return logTime;
	}

	public void setLogTime(String logTime) {
		this.logTime = logTime;
	}

	public String toString() {
		StringBuffer str = new StringBuffer(50);
		str.append("router_id=").append(routerId);
		str.append(",src_ip=").append(NetFlowUtil.convertIP(srcIP));
		str.append(",src_port=").append(srcPort);
		str.append(",dst_ip=").append(NetFlowUtil.convertIP(dstIP));
		str.append(",dst_port=").append(dstPort);
		str.append(",in_if=").append(inIf);
		str.append(",out_if=").append(outIf);
		str.append(",protocol=").append(protocol);
		str.append(",bytes=").append(bytes);
		str.append(",log_time=").append(logTime);
		return str.toString();
	}
}