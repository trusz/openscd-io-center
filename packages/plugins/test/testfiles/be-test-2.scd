<SCL xmlns:sxy="http://www.iec.ch/61850/2003/SCLcoordinates"
	xmlns="http://www.iec.ch/61850/2003/SCL"
	xmlns:txy="http://www.iec.ch/61850/2003/Terminal" version="2007" revision="B" release="4">
	<Header id="SCD_LPDI_LPDO_Example" version="1.0" revision="0" toolID="OpenSCD">
		<Text>Example SCD file with LPDI and LPDO definitions</Text>
	</Header>
	<Substation name="ExampleSubstation">
		<VoltageLevel name="VL1">
			<Bay name="Bay1">
				<ConductingEquipment name="CE1" type="CBR" />
			</Bay>
		</VoltageLevel>
	</Substation>
	<IED name="IED1" type="Protection" manufacturer="ExampleManufacturer">
		<AccessPoint name="P1">
			<Server>
				<LDevice inst="LD1">
					<LN0 lnClass="LLN0" inst="" lnType="LLN0_Example"/>
					<LN lnClass="LPDI" inst="1" lnType="LPDI_Example">
						<DataSet name="dsLPDI">
							<FCDA ldInst="LD1" prefix="" lnClass="LPDI" lnInst="1" doName="In" daName="stVal"/>
						</DataSet>
						<GOOSEControl name="gocLPDI" datSet="dsLPDI" confRev="1" />
					</LN>
					<LN lnClass="LPDO" inst="1" lnType="LPDO_Example">
						<DataSet name="dsLPDO">
							<FCDA ldInst="LD1" prefix="" lnClass="LPDO" lnInst="1" doName="RdbSt" daName="stVal"/>
						</DataSet>
						<GOOSEControl name="gocLPDO" datSet="dsLPDO" confRev="1" />
					</LN>
				</LDevice>
			</Server>
		</AccessPoint>
	</IED>
	<DataTypeTemplates>
		<LNodeType id="LLN0_Example" lnClass="LLN0">
			<DO name="Mod" type="ENC_ModeKind"/>
			<DO name="Beh" type="ENC_BehaviourModeKind"/>
			<DO name="Health" type="ENS_Health"/>
		</LNodeType>
		<LNodeType id="LPDI_Example" lnClass="LPDI">
			<DO name="In" type="SPS"/>
			<DO name="BrdRef" type="VSD"/>
			<DO name="DsgInpCom" type="VSD" presCond="Omulti/na"/>
			<DO name="DsgInpSig" type="VSD"/>
			<DO name="FctInpCom" type="VSD" presCond="Omulti/na"/>
			<DO name="FctInpSig" type="VSD"/>
			<DO name="InpNam" type="VSD"/>
			<DO name="InpRefDsg" type="VSD"/>
			<DO name="NamPlt" type="LPL"/>
			<DO name="Beh" type="ENS_BehaviourModeKind"/>
			<DO name="Health" type="ENS_Health"/>
			<DO name="Mir" type="SPS"/>
			<DO name="Mod" type="ENC_BehaviourModeKind"/>
			<DO name="DebTm" type="ING"/>
			<DO name="VInOff" type="ASG"/>
			<DO name="VInOn" type="ASG"/>
			<DO name="VInTyp" type="ENG_InputVoltageKind"/>
		</LNodeType>
		<LNodeType id="LPDO_Example" lnClass="LPDO">
			<DO name="RdbSt" type="SPS"/>
			<DO name="BrdRef" type="VSD"/>
			<DO name="DsgOutCom" type="VSD" presCond="Omulti/na"/>
			<DO name="DsgOutSig" type="VSD" presCond="Omulti/na"/>
			<DO name="FctOutCom" type="VSD" presCond="Omulti/na"/>
			<DO name="FctOutSig" type="VSD" presCond="Omulti/na"/>
			<DO name="OutNam" type="VSD"/>
			<DO name="OutOffCap" type="VSD"/>
			<DO name="OutOnCap" type="VSD"/>
			<DO name="OutRefDsg" type="VSD"/>
			<DO name="NamPlt" type="LPL"/>
			<DO name="Beh" type="ENS_BehaviourModeKind"/>
			<DO name="Health" type="ENS_Health"/>
			<DO name="Mir" type="SPS"/>
			<DO name="Mod" type="ENC_BehaviourModeKind"/>
			<DO name="FastOut" type="SPG"/>
			<DO name="OutOffDl" type="ASG"/>
			<DO name="OutOnDl" type="ASG"/>
			<DO name="OutTyp" type="ENG_OutputKind" presCond="Omulti/na"/>
		</LNodeType>
		<DOType id="SPS" cdc="SPS">
			<DA name="stVal" bType="BOOLEAN" fc="ST"/>
			<DA name="q" bType="Quality" fc="ST"/>
			<DA name="t" bType="Timestamp" fc="ST"/>
		</DOType>
		<DOType id="VSD" cdc="VSD">
			<DA name="value" bType="VisString255" fc="ST"/>
		</DOType>
		<DOType id="LPL" cdc="LPL">
			<DA name="ldNs" bType="VisString255" fc="EX"/>
			<DA name="configNs" bType="VisString255" fc="EX"/>
			<DA name="vendor" bType="VisString255" fc="EX"/>
			<DA name="swRev" bType="VisString255" fc="EX"/>
			<DA name="d" bType="VisString255" fc="EX"/>
			<DA name="configVersion" bType="VisString255" fc="EX"/>
		</DOType>
		<DOType id="ENC_ModeKind" cdc="ENC">
			<DA name="stVal" bType="Enum" fc="ST" type="ModeKind"/>
		</DOType>
		<DOType id="ENC_BehaviourModeKind" cdc="ENC">
			<DA name="stVal" bType="Enum" fc="ST" type="BehaviourModeKind"/>
		</DOType>
		<DOType id="ENS_BehaviourModeKind" cdc="ENS">
			<DA name="stVal" bType="Enum" fc="ST" type="BehaviourModeKind"/>
		</DOType>
		<DOType id="ENS_Health" cdc="ENS">
			<DA name="stVal" bType="Enum" fc="ST" type="HealthKind"/>
		</DOType>
		<DOType id="ASG" cdc="ASG">
			<DA name="setMag" bType="FLOAT32" fc="ST"/>
		</DOType>
		<DOType id="ING" cdc="ING">
			<DA name="setMag" bType="INT32" fc="ST"/>
		</DOType>
		<DOType id="ENG_InputVoltageKind" cdc="ENG">
			<DA name="setMag" bType="Enum" fc="ST" type="InputVoltageKind"/>
		</DOType>
		<DOType id="ENG_OutputKind" cdc="ENG">
			<DA name="setMag" bType="Enum" fc="ST" type="OutputKind"/>
		</DOType>
		<EnumType id="BehaviourModeKind">
			<EnumVal ord="1">on</EnumVal>
			<EnumVal ord="2">blocked</EnumVal>
			<EnumVal ord="3">test</EnumVal>
			<EnumVal ord="4">test/blocked</EnumVal>
			<EnumVal ord="5">off</EnumVal>
		</EnumType>
		<EnumType id="HealthKind">
			<EnumVal ord="1">ok</EnumVal>
			<EnumVal ord="2">warning</EnumVal>
			<EnumVal ord="3">alarm</EnumVal>
		</EnumType>
		<EnumType id="InputVoltageKind">
			<EnumVal ord="1">AC</EnumVal>
			<EnumVal ord="2">DC</EnumVal>
		</EnumType>
		<EnumType id="OutputKind">
			<EnumVal ord="1">Normally Open</EnumVal>
			<EnumVal ord="2">Normally Closed</EnumVal>
			<EnumVal ord="3">Change-over</EnumVal>
		</EnumType>
	</DataTypeTemplates>
</SCL>
