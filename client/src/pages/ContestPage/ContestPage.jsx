import React, { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import isEqual from 'lodash/isEqual';
import LightBox from 'react-18-image-lightbox';
import { useParams, useNavigate } from 'react-router-dom';
import {
  getContestById,
  setOfferStatus,
  clearSetOfferStatusError,
  changeEditContest,
  changeContestViewMode,
  changeShowImage,
} from '../../store/slices/contestByIdSlice';
import { goToExpandedDialog } from '../../store/slices/chatSlice';
import Header from '../../components/Header/Header';
import ContestSideBar from '../../components/ContestSideBar/ContestSideBar';
import styles from './ContestPage.module.sass';
import OfferBox from '../../components/OfferBox/OfferBox';
import OfferForm from '../../components/OfferForm/OfferForm';
import CONSTANTS from '../../constants';
import Brief from '../../components/Brief/Brief';
import Spinner from '../../components/Spinner/Spinner';
import TryAgain from '../../components/TryAgain/TryAgain';
import 'react-18-image-lightbox/style.css';
import Error from '../../components/Error/Error';

const ContestPage = () => {
  const dispatch = useDispatch();
  const params = useParams();
  const navigate = useNavigate();

  const contestByIdStore = useSelector((state) => state.contestByIdStore);
  const userStore = useSelector((state) => state.userStore);
  const chatStore = useSelector((state) => state.chatStore);

  const { role } = userStore.data;
  const {
    isShowOnFull,
    imagePath,
    error,
    isFetching,
    isBrief,
    contestData,
    offers,
    setOfferStatusError,
  } = contestByIdStore;

  useEffect(() => {
    dispatch(changeEditContest(false));
    // eslint-disable-next-line
  }, []);

  const getData = useCallback(() => {
    dispatch(getContestById({ contestId: params.id }));
  }, [dispatch, params.id]);

  useEffect(() => {
    getData();
    // eslint-disable-next-line
  }, [getData]);

  const setOffersList = useCallback(() => {
    const offersToShow = offers.filter(
      (offer) =>
        offer.status === CONSTANTS.OFFER_STATUS_VISIBLE ||
        offer.status === CONSTANTS.OFFER_STATUS_WON
    );
    if (offersToShow.length === 0) {
      return (
        <div className={styles.notFound}>
          There is no suggestion at this moment
        </div>
      );
    }
    return offersToShow.map((offer) => (
      <OfferBox
        data={offer}
        key={offer.id}
        needButtons={needButtons}
        setOfferStatus={setOfferStatusHandler}
        contestType={contestData.contestType}
        date={new Date()}
      />
    ));
    // eslint-disable-next-line
  }, [offers, contestData]);

  const needButtons = useCallback(
    (offerStatus) => {
      if (!contestData?.User) return false;
      const contestCreatorId = contestData.User.id;
      const userId = userStore.data.id;
      const contestStatus = contestData.status;
      return (
        contestCreatorId === userId &&
        contestStatus === CONSTANTS.CONTEST_STATUS_ACTIVE &&
        offerStatus === CONSTANTS.OFFER_STATUS_VISIBLE
      );
    },
    [contestData, userStore.data.id]
  );

  const setOfferStatusHandler = useCallback(
    (creatorId, offerId, command) => {
      dispatch(clearSetOfferStatusError());
      const { id, orderId, priority } = contestData;
      const obj = {
        command,
        offerId,
        creatorId,
        orderId,
        priority,
        contestId: id,
      };
      dispatch(setOfferStatus(obj));
    },
    [dispatch, contestData]
  );

  const findConversationInfo = useCallback(
    (interlocutorId) => {
      const { messagesPreview } = chatStore;
      const { id } = userStore.data;
      const participants = [id, interlocutorId];
      participants.sort(
        (participant1, participant2) => participant1 - participant2
      );
      for (let i = 0; i < messagesPreview.length; i++) {
        if (isEqual(participants, messagesPreview[i].participants)) {
          return {
            participants: messagesPreview[i].participants,
            _id: messagesPreview[i]._id,
            blackList: messagesPreview[i].blackList,
            favoriteList: messagesPreview[i].favoriteList,
          };
        }
      }
      return null;
    },
    [chatStore, userStore.data]
  );

  const goChat = useCallback(() => {
    if (!contestData?.User) return;
    dispatch(
      goToExpandedDialog({
        interlocutor: contestData.User,
        conversationData: findConversationInfo(contestData.User.id),
      })
    );
  }, [dispatch, contestData, findConversationInfo]);

  return (
    <div>
      {isShowOnFull && (
        <LightBox
          mainSrc={`${CONSTANTS.publicURL}${imagePath}`}
          onCloseRequest={() =>
            dispatch(changeShowImage({ isShowOnFull: false, imagePath: null }))
          }
        />
      )}
      {error ? (
        <div className={styles.tryContainer}>
          <TryAgain getData={getData} />
        </div>
      ) : isFetching ? (
        <div className={styles.containerSpinner}>
          <Spinner />
        </div>
      ) : (
        <div className={styles.mainInfoContainer}>
          <div className={styles.infoContainer}>
            <div className={styles.buttonsContainer}>
              <span
                onClick={() => dispatch(changeContestViewMode(true))}
                className={classNames(styles.btn, {
                  [styles.activeBtn]: isBrief,
                })}
              >
                Brief
              </span>
              <span
                onClick={() => dispatch(changeContestViewMode(false))}
                className={classNames(styles.btn, {
                  [styles.activeBtn]: !isBrief,
                })}
              >
                Offer
              </span>
            </div>
            {isBrief ? (
              <Brief
                contestData={contestData}
                role={role}
                goChat={goChat}
              />
            ) : (
              <div className={styles.offersContainer}>
                {role === CONSTANTS.CREATOR &&
                  contestData.status === CONSTANTS.CONTEST_STATUS_ACTIVE && (
                    <OfferForm
                      contestType={contestData.contestType}
                      contestId={contestData.id}
                      customerId={contestData.User.id}
                    />
                  )}
                {setOfferStatusError && (
                  <Error
                    data={setOfferStatusError.data}
                    status={setOfferStatusError.status}
                    clearError={() => dispatch(clearSetOfferStatusError())}
                  />
                )}
                <div className={styles.offers}>{setOffersList()}</div>
              </div>
            )}
          </div>
          <ContestSideBar
            contestData={contestData}
            totalEntries={
              offers.filter(
                (offer) =>
                  offer.status === CONSTANTS.OFFER_STATUS_VISIBLE ||
                  offer.status === CONSTANTS.OFFER_STATUS_WON
              ).length
            }
          />
        </div>
      )}
    </div>
  );
};

export default ContestPage;