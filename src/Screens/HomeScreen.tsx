import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import FlipCard from 'react-native-flip-card';

const promoImage = require('../assets/promo.jpeg');

const HomeScreen = () => {
  const [flipState, setFlipState] = useState(false); 
  const [flipping, setFlipping] = useState(true);
  let flipInterval: NodeJS.Timeout;

  useEffect(() => {
    if (flipping) {
      flipInterval = setInterval(() => {
        setFlipState((prev) => !prev); 
      }, 5000);
    } else {
      clearInterval(flipInterval); 
    }

    return () => clearInterval(flipInterval); 
  }, [flipping]);

  const handleCardPress = () => {
    setFlipping(false); 
  };

  return (
    <View style={styles.container}>
      {/* Fixed Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerLeftSide}>
          <Icon name="person-outline" size={18} color="#fff" style={styles.headerIconStyle} />
          <Text style={styles.headerTitleText}>Account</Text>
        </View>
        <View style={styles.headerRightSide}>
          <TouchableOpacity style={styles.approvalsButtonContainer}>
            <Icon name="notifications-outline" size={18} color="#fff" />
            <Text style={styles.approvalsText}>Approvals</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Scrollable Content */}
      <ScrollView contentContainerStyle={styles.scrollableContent}>
        {/* Balance Section */}
        <View style={styles.balanceCardContainer}>
          <FlipCard
            friction={100}
            perspective={9000}
            flipHorizontal={true}
            flipVertical={false}
            flip={flipState} 
            style={styles.flipCardStyle}
          >
            {/* Front Side - Savings Balance */}
            <View style={styles.cardSideContainer} onTouchStart={handleCardPress}>
              <Text style={styles.balanceText}>Savings Target</Text>
              <Text style={styles.amountText}>UGX 500,000</Text>
              <TouchableOpacity style={styles.transactionsButtonContainer}>
                <Icon name="swap-horizontal-outline" size={20} color="#075E54" />
                <Text style={styles.transactionsText}>View Transactions</Text>
              </TouchableOpacity>
            </View>

            {/* Back Side - Loan Balance */}
            <View style={styles.cardSideContainer}>
              <Text style={styles.balanceText}>Amount Saved </Text>
              <Text style={styles.amountText}>UGX 250,000</Text>
              <TouchableOpacity style={styles.transactionsButtonContainer}>
                <Icon name="swap-horizontal-outline" size={20} color="#075E54" />
                <Text style={styles.transactionsText}>View Transactions</Text>
              </TouchableOpacity>
            </View>
          </FlipCard>
        </View>

        {/* Navigation Tabs */}
        <View style={styles.navigationTabsContainer}>
          <TouchableOpacity style={styles.tabItemCircle}>
            <Icon name="card-outline" size={24} color="#075E54" />
            <Text style={styles.tabText}>Savings</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItemCircle}>
            <Icon name="stats-chart-outline" size={24} color="#075E54" />
            <Text style={styles.tabText}>Assets</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.tabItemCircle}>
            <Icon name="cash-outline" size={24} color="#075E54" />
            <Text style={styles.tabText}>Loans</Text>
          </TouchableOpacity>
        </View>

        {/* Actions Section */}
        <View style={styles.actionsSectionContainer}>
          <View style={styles.actionsRowContainer}>
            <TouchableOpacity style={styles.actionItemContainer}>
              <Icon name="home-outline" size={28} color="#075E54" />
              <Text style={styles.actionText}>Bank Statement</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItemContainer}>
              <Icon name="wallet-outline" size={28} color="#075E54" />
              <Text style={styles.actionText}>Mobile Money Statement</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.actionsWrapper}>
            <TouchableOpacity style={styles.actionItemContainer}>
              <Icon name="document-outline" size={28} color="#075E54" />
              <Text style={styles.actionText}>Manual Entries</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionItemContainer}>
              <Icon name="people-outline" size={28} color="#075E54" />
              <Text style={styles.actionText}>Others</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Offers & Promos Section */}
        <View style={styles.promosSectionContainer}>
          <Image
            source={promoImage} 
            style={styles.promoImageStyle}
          />
          <TouchableOpacity style={styles.offerButtonContainer}>
            <Text style={styles.offerText}>Explore Offers</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    position: 'absolute', 
    top: 0,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#075E54',
    elevation: 3,
    zIndex: 10, 
  },
  headerLeftSide: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerRightSide: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  headerTitleText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginTop: 4,
  },
  headerIconStyle: {
    color: '#fff',
  },
  approvalsButtonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    marginRight: 6,
  },
  approvalsText: {
    color: '#fff',
    marginTop: 4,
    fontSize: 10,
    fontWeight: 'bold',
  },
  scrollableContent: {
    paddingTop: 80, 
  },
  balanceCardContainer: {
    backgroundColor: '#075E54',
    padding: 10,
    margin: 15,
    marginTop: 16,
    borderRadius: 10,
    alignItems: 'center',
    elevation: 2,
    height: 180,
    width: '90%',
    overflow: 'hidden',
  },
  flipCardStyle: {
    width: '100%',
    height: '100%',
  },
  cardSideContainer: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    backfaceVisibility: 'hidden',
    borderRadius: 10,
    backgroundColor: '#075E54',
  },
  balanceText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  amountText: {
    color: '#fff',
    fontSize: 28,
    fontWeight: 'bold',
    marginVertical: 12,
  },
  transactionsButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  transactionsText: {
    color: '#fff',
    marginLeft: 4,
    fontWeight: 'bold',
  },
  navigationTabsContainer: {
    flexDirection: 'row',
    marginHorizontal: 8,
    marginVertical: 18,
  },
  tabItemCircle: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 5,
    justifyContent: 'center',
    backgroundColor: '#fff',
    borderRadius: 70,
    elevation: 2,
    marginHorizontal: 15,
  },
  tabText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#075E54',
  },
  actionsSectionContainer: {
    paddingVertical: 12,
  },
  actionsRowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 6,
    marginBottom: 6,
  },
  actionsWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 6,
    marginBottom: 6,
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 6,
    elevation: 2,
  },
  actionItemContainer: {
    alignItems: 'center',
    width: '48%',
    padding: 5,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 2,
  },
  actionText: {
    marginTop: 4,
    fontSize: 10,
    color: '#000000',
  },
  promosSectionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    backgroundColor: '#fff',
    margin: 15,
    borderRadius: 10,
    elevation: 2,
  },
  promoImageStyle: {
    width: 160,
    height: 80,
    borderRadius: 10,
  },
  offerButtonContainer: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#075E54',
    borderRadius: 5,
  },
  offerText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  referText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#075E54',
  },
});

export default HomeScreen;
