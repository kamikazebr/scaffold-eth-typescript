import React, { useState } from 'react';
import { Main, Button, IconPlus, Modal, Split } from '@1hive/1hive-ui';
import VestedList from '../../VestedList/index';
import { UserVestingList } from '../../UserVestingList';
import { Add, Wrap, Redeem } from '../../Modals';
import { Row, SectionTitle, Section } from './home.styled';

const MODAL_WIDTH = {
  deploy: '500px',
  redeem: '350px',
  wrap: '450px',
};

export type MODAL_MODES = 'deploy' | 'wrap' | 'redeem' | null;

function Home({
  contractLoader,
  address,
  writeContracts,
  tx,
}: {
  contractLoader: any;
  address: any;
  writeContracts: any;
  tx: any;
}) {
  const [opened, setOpened] = useState(false);
  const [modalMode, setModalMode] = useState<MODAL_MODES>(null); // deploy, redeem, wrap
  const [wrapContract, setWrapContract] = useState<string | null>(null);

  const handleShowModal = (mode: MODAL_MODES) => {
    setOpened(true);
    setModalMode(mode);
  };
  const handleHideModal = () => {
    setOpened(false);
    setModalMode(null);
    setWrapContract(null);
  };
  const handleDeployVestedToken = () => handleShowModal('deploy');
  const handleRedeemVesting = (id: string | null) => {
    setWrapContract(id);
    handleShowModal('redeem');
  };
  const handleWrapVesting = (id: string | null) => {
    setWrapContract(id);
    handleShowModal('wrap');
  };

  return (
    <Main assetsUrl="/aragon-ui/">
      <Row style={{ display: 'flex', justifyContent: 'center' }}>
        <Button mode="strong" onClick={handleDeployVestedToken} label="Add new vesting" icon={<IconPlus />} />
      </Row>

      {address ? (
        <Split
          primary={
            <Section>
              <SectionTitle small>My vestings</SectionTitle>
              <UserVestingList address={address} onRedeemVesting={handleRedeemVesting} />
            </Section>
          }
          secondary={
            <Section>
              <SectionTitle small>Vesting tokens</SectionTitle>
              <VestedList handleWrapVesting={handleWrapVesting} />
            </Section>
          }
        />
      ) : (
        <Section>
          <SectionTitle small>Vesting tokens</SectionTitle>
          <VestedList handleWrapVesting={handleWrapVesting} />
        </Section>
      )}

      <Modal visible={opened} closeButton={false} width={modalMode && MODAL_WIDTH[modalMode]}>
        {modalMode === 'deploy' && <Add writeContracts={writeContracts} tx={tx} closeModal={handleHideModal} />}
        {modalMode === 'redeem' && (
          <Redeem
            vestedId={wrapContract}
            contractLoader={contractLoader}
            tx={tx}
            closeModal={handleHideModal}
            address={address}
          />
        )}
        {modalMode === 'wrap' && (
          <Wrap
            contractLoader={contractLoader}
            vestedId={wrapContract}
            tx={tx}
            closeModal={handleHideModal}
            accountAddress={address}
          />
        )}
      </Modal>
    </Main>
  );
}

export default Home;
