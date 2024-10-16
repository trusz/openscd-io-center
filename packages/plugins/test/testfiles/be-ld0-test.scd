<SCL xmlns:sxy="http://www.iec.ch/61850/2003/SCLcoordinates"
     xmlns="http://www.iec.ch/61850/2003/SCL"
     xmlns:txy="http://www.iec.ch/61850/2003/Terminal" version="2007" revision="B" release="4">
  <Header id="SCD_LPDI_LPDO_Example" version="1.0" revision="0" toolID="OpenSCD">
    <Text>Example SCD file with multiple IEDs linking LPDI to LPDO</Text>
  </Header>
  <Substation name="ExampleSubstation">
    <VoltageLevel name="VL1">
      <Bay name="Bay1">
        <ConductingEquipment name="CE1" type="CBR"/>
      </Bay>
    </VoltageLevel>
  </Substation>
  
  <!-- IED1 with LD0 -->
  <IED name="IED1" type="Protection" manufacturer="ExampleManufacturer">
    <AccessPoint name="P1">
      <Server>
        <!-- LD0 special LDevice -->
        <LDevice inst="LD0">
          <LN0 lnClass="LLN0" inst="" lnType="LD0.LLN0"/>

          <LN lnClass="LPDI" inst="LPDI-1" lnType="LPDILPDI-1">
						<DOI name="Ind" desc="Der erste LPDI">
							<DAI name="q">
								<Val>123</Val>
							</DAI>
						</DOI>
					</LN>

          <LN lnClass="LPDI" inst="1" lnType="FieldA_QA1_QB1_QB2_QC9CBSW.LPDI1">
						<DOI name="Ind">
							<DAI name="stVal">
								<Val>true</Val>
							</DAI>
						</DOI>

						<DOI name="BrdRef">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
						<DOI name="DsgInpCom">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
						<DOI name="DsgInpSig">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
						<DOI name="FctInpCom">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
						<DOI name="FctInpSig">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
						<DOI name="InpNam">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
						<DOI name="InpRefDsg">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
						<DOI name="NamPlt">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
						<DOI name="In">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
						<DOI name="Beh">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
						<DOI name="Health">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
						<DOI name="Mir">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
						<DOI name="Mod">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
						<DOI name="DebTm">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
						<DOI name="VInOff">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
						<DOI name="VInOn">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
						<DOI name="VInTyp">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
						<DOI name="InRef">
							<DAI name="stVal">
								<Val>exampleValue</Val>
							</DAI>
						</DOI>
					</LN>
<!-- 
          <LN lnClass="LRTD" inst="1" lnType="LRTD">
              <DOI name="InOff" desc="">
                  <LNRef refLDInst="LD0" refLNClass="LPDI" refLnInst="LPDI-1" refDo="Ind"/>
              </DOI>
              <DOI name="InON" desc="">
                  <LNRef refLDInst="LD0" refLNClass="LPDI" refLnInst="LPDI-2" refDo="Ind"/>
              </DOI>
              <DOI name="DpsInd" desc="">
                  <LNRef refLDInst="CircuitBreaker_CB1"  refLNClass="XCBR" refLnInst="1" refDo="Pos"/>
              </DOI>
          </LN> -->

        </LDevice>

        <LDevice inst="CircuitBreaker_CB1" desc="XCBR">
          <LN0 lnClass="LLN0" inst="" lnType="CB1.LLN0"/>

          <LN lnClass="XCBR" inst="1" lnType="CB1.XCBR1">
            <DOI name="Pos">
              <DAI name="ctlModel">
                <Val>status-only</Val>
              </DAI>
            </DOI>
          </LN>
          
        </LDevice>
      </Server>
    </AccessPoint>
  </IED>

<DataTypeTemplates>
    <!-- Begin LNodeTypes for LD0 -->
    <LNodeType id="LD0.LLN0" lnClass="LLN0">
      <DO name="Mod" type="ENC_ModeKind"/>
      <DO name="Beh" type="ENC_BehaviourModeKind"/>
      <DO name="Health" type="ENS_Health"/>
    </LNodeType>

    <LNodeType id="LRTD" lnClass="LRTD">
      <DO name="NamPlt" type="LPL"/>
      <DO name="DpsInd" type="DPS"/>
      <DO name="Beh" type="ENS_Beh"/>
      <DO name="Health" type="ENS_Health"/>
      <DO name="Mir" type="SPS"/>
      <DO name="Mod" type="ENC_Mod"/>
      <DO name="ActOffHi" type="SPG"/>
      <DO name="ActOnHi" type="SPG"/>
      <DO name="OscTm" type="ING"/>
      <DO name="OscNum" type="ING"/>
      <DO name="InRef" type="ORG"/>
    </LNodeType>

    <LNodeType id="NewType.LPDI" lnClass="LPDI">
      <DO name="Ind" type="NewType.SPS"/>
      <DO name="BrdRef" type="NewType.VSD"/>
      <DO name="DsgInpCom" type="NewType.VSD" presCond="M"/>
      <DO name="DsgInpSig" type="NewType.VSD"/>
      <DO name="FctInpCom" type="NewType.VSD" presCond="M"/>
      <DO name="FctInpSig" type="NewType.VSD"/>
      <DO name="InpNam" type="NewType.VSD"/>
      <DO name="InpRefDsg" type="NewType.VSD"/>
      <DO name="NamPlt" type="NewType.LPL"/>
      <DO name="In" type="NewType.SPS"/>
      <DO name="Beh" type="NewType.ENS_Beh" cdc="ENS"/>
      <DO name="Health" type="NewType.ENS_Health"/>
      <DO name="Mir" type="NewType.SPS"/>
      <DO name="Mod" type="NewType.ENC_Mod"/>
      <DO name="DebTm" type="NewType.ING"/>
      <DO name="VInOff" type="NewType.ASG"/>
      <DO name="VInOn" type="NewType.ASG"/>
      <DO name="VInTyp" type="NewType.ENG_InputVoltage"/>
    </LNodeType>

    <LNodeType id="NewType.LPDO" lnClass="LPDO">
      <DO name="RdbSt" type="NewType.SPS"/>
      <DO name="BrdRef" type="NewType.VSD"/>
      <DO name="DsgOutCom" type="NewType.VSD" presCond="M"/>
      <DO name="DsgOutSig" type="NewType.VSD" presCond="M"/>
      <DO name="FctOutCom" type="NewType.VSD" presCond="M"/>
      <DO name="FctOutSig" type="NewType.VSD" presCond="M"/>
      <DO name="OutNam" type="NewType.VSD"/>
      <DO name="OutOffCap" type="NewType.VSD"/>
      <DO name="OutOnCap" type="NewType.VSD"/>
      <DO name="OutRefDsg" type="NewType.VSD"/>
      <DO name="NamPlt" type="NewType.LPL"/>
      <DO name="Beh" type="NewType.ENS_Beh"/>
      <DO name="Health" type="NewType.ENS_Health"/>
      <DO name="Mir" type="NewType.SPS"/>
      <DO name="Mod" type="NewType.ENC_Mod"/>
      <DO name="FastOut" type="NewType.SPG"/>
      <DO name="OutOffDl" type="NewType.ASG"/>
      <DO name="OutOnDl" type="NewType.ASG"/>
      <DO name="OutTyp" type="NewType.ENG_Output" presCond="m"/>
    </LNodeType>

    <LNodeType lnClass="LLN0" id="CB1.LLN0">
      <DO name="Mod" type="CB1.LLN0.Mod" />
      <DO name="SomeMod" type="NonExistingType" />
      <DO name="ExtendedMod" type="CB1.LLN0.ExtendedMod" />
      <DO name="Beh" type="CB1.LLN0.Beh" />
      <DO name="Health" type="CB1.LLN0.Health" />
      <DO name="NamPlt" type="CB1.LLN0.NamPlt" />
    </LNodeType>

    <LNodeType lnClass="XCBR" id="CB1.XCBR1">
      <DO name="Beh" type="CB1.LLN0.beh" />
      <DO name="NamPlt" type="CB1.XCBR.NamPlt" />
      <DO name="Loc" type="CB1.XCBR.SPS" />
      <DO name="OpCnt" type="CB1.XCBR.OpCnt" />
      <DO name="Pos" type="CB1.XCBR.Pos" />
      <DO name="BlkOpn" type="CB1.XCBR.BlkOpn" />
      <DO name="BlkCls" type="CB1.XCBR.BlkOpn" />
    </LNodeType>

    <DOType cdc="SPS" id="NewType.SPS">
      <DA fc="ST" dchg="true" name="stVal" bType="BOOLEAN"/>
      <DA fc="ST" qchg="true" name="q" bType="Quality"/>
      <DA fc="ST" name="t" bType="Timestamp"/>
    </DOType>

    <DOType cdc="SPS" id="NewType.SPS">
      <DA fc="ST" dchg="true" name="stVal" bType="BOOLEAN"/>
      <DA fc="ST" qchg="true" name="q" bType="Quality"/>
      <DA fc="ST" name="t" bType="Timestamp"/>
    </DOType>

    <DOType cdc="SPS" id="NewType.SPS">
      <DA fc="ST" dchg="true" name="stVal" bType="BOOLEAN"/>
      <DA fc="ST" qchg="true" name="q" bType="Quality"/>
      <DA fc="ST" name="t" bType="Timestamp"/>
    </DOType>

    <DOType cdc="VSD" id="NewType.VSD">
      <DA name="value" bType="VisString255" fc="ST"/>
    </DOType>

    <DOType cdc="LPL" id="NewType.LPL">
      <DA fc="DC" name="vendor" bType="VisString255"/>
      <DA fc="DC" name="swRev" bType="VisString255"/>
      <DA fc="DC" name="d" bType="VisString255"/>
    </DOType>

    <DOType cdc="ENS" id="NewType.ENS_Beh">
  <DA fc="ST" dchg="true" name="stVal" bType="Enum" type="BehaviorModeKind"/>
  <DA fc="ST" qchg="true" name="q" bType="Quality"/>
  <DA fc="ST" name="t" bType="Timestamp"/>
</DOType>

<DOType cdc="ENS" id="NewType.ENS_Health">
  <DA fc="ST" dchg="true" name="stVal" bType="Enum" type="HealthStateKind"/>
  <DA fc="ST" qchg="true" name="q" bType="Quality"/>
  <DA fc="ST" name="t" bType="Timestamp"/>
</DOType>

<DOType cdc="ENC" id="NewType.ENC_Mod">
  <DA fc="ST" dchg="true" name="stVal" bType="Enum" type="ModeKind"/>
  <DA fc="ST" qchg="true" name="q" bType="Quality"/>
  <DA fc="ST" name="t" bType="Timestamp"/>
</DOType>

<DOType cdc="ING" id="NewType.ING">
  <DA fc="ST" dchg="true" name="stVal" bType="INT32"/>
  <DA fc="ST" qchg="true" name="q" bType="Quality"/>
  <DA fc="ST" name="t" bType="Timestamp"/>
</DOType>

<DOType cdc="ASG" id="NewType.ASG">
  <DA fc="ST" dchg="true" name="setVal" bType="FLOAT32"/>
</DOType>

<DOType cdc="ENG" id="NewType.ENG_InputVoltage">
  <DA fc="ST" dchg="true" name="mag" bType="FLOAT32"/>
  <DA fc="ST" name="q" bType="Quality"/>
  <DA fc="ST" name="t" bType="Timestamp"/>
</DOType>

<DOType cdc="ENG" id="NewType.ENG_Output">
  <DA fc="ST" dchg="true" name="mag" bType="FLOAT32"/>
  <DA fc="ST" name="q" bType="Quality"/>
  <DA fc="ST" name="t" bType="Timestamp"/>
</DOType>

<DOType cdc="SPG" id="NewType.SPG">
  <DA fc="ST" dchg="true" name="stVal" bType="BOOLEAN"/>
  <DA fc="ST" name="t" bType="Timestamp"/>
</DOType>

<DOType cdc="ENC" id="CB1.LLN0.Mod">
  <DA fc="ST" dchg="true" name="stVal" bType="Enum" type="ModeKind"/>
  <DA fc="ST" qchg="true" name="q" bType="Quality"/>
  <DA fc="ST" name="t" bType="Timestamp"/>
</DOType>

<DOType cdc="ENC" id="CB1.LLN0.ExtendedMod">
  <DA fc="ST" dchg="true" name="stVal" bType="Enum" type="ExtendedModeKind"/>
  <DA fc="ST" qchg="true" name="q" bType="Quality"/>
  <DA fc="ST" name="t" bType="Timestamp"/>
</DOType>

<DOType cdc="SPS" id="CB1.XCBR.SPS">
  <DA fc="ST" dchg="true" name="stVal" bType="BOOLEAN"/>
  <DA fc="ST" qchg="true" name="q" bType="Quality"/>
  <DA fc="ST" name="t" bType="Timestamp"/>
</DOType>

<DOType cdc="DPC" id="CB1.XCBR.Pos">
  <DA fc="ST" dchg="true" name="stVal" bType="DbPos"/>
  <DA fc="ST" qchg="true" name="q" bType="Quality"/>
  <DA fc="ST" name="t" bType="Timestamp"/>
</DOType>

<DOType cdc="DPS" id="CB1.XCBR.BlkOpn">
  <DA fc="ST" dchg="true" name="stVal" bType="BOOLEAN"/>
  <DA fc="ST" qchg="true" name="q" bType="Quality"/>
  <DA fc="ST" name="t" bType="Timestamp"/>
</DOType>

<DOType cdc="DPS" id="CB1.XCBR.BlkCls">
  <DA fc="ST" dchg="true" name="stVal" bType="BOOLEAN"/>
  <DA fc="ST" qchg="true" name="q" bType="Quality"/>
  <DA fc="ST" name="t" bType="Timestamp"/>
</DOType>


    <LNodeType id="CB1.LLN0" lnClass="LLN0">
      <DO name="Mod" type="ENC_ModeKind"/>
      <DO name="Beh" type="ENC_BehaviourModeKind"/>
      <DO name="Health" type="ENS_Health"/>
    </LNodeType>

    <DOType cdc="Pos" id="CB1.XCBR.Pos">
      <DA fc="CO" name="ctlVal" bType="BOOLEAN"/>
      <DA fc="ST" name="stVal" bType="BOOLEAN"/>
      <DA fc="CO" name="ctlNum" bType="INT32"/>
      <DA fc="ST" name="subVal" bType="BOOLEAN"/>
      <DA fc="ST" name="q" bType="Quality"/>
      <DA fc="ST" name="t" bType="Timestamp"/>
    </DOType>

  </DataTypeTemplates>
</SCL>
