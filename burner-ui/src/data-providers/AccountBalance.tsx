import React, { Component } from 'react';
import { withBurner, BurnerContext } from '../BurnerProvider';

const POLL_INTERVAL = 1000;

interface AccountBalanceProps {
  asset: string,
  account: string,
  render: (any) => React.ReactNode,
}

interface Transaction {
  balance: string,
  displayBalance: string,
  usdBalance: string,
}

class AccountBalance extends Component<BurnerContext & AccountBalanceProps, any> {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      err: null,
    };
    this.timer = null;
  }

  componentDidMount() {
    this.fetchData();
    this.poll();
  }

  componentDidUpdate(oldProps) {
    if (this.props !== oldProps) {
      this.fetchData();
    }
  }

  poll() {
    this.timer = setTimeout(async () => {
      await this.fetchData();
      this.poll();
    }, POLL_INTERVAL);
  }

  async fetchData() {
    try {
      const assetList = this.props.assets.filter(asset => asset.id == this.props.asset);
      if (assetList.length == 0) {
        throw new Error(`Unable to find asset ${this.props.asset}`);
      }
      const asset = assetList[0];

      const balance = await asset.getBalance(this.props.account);
      const data = {
        balance,
        displayBalance: asset.getDisplayValue(balance),
        usdBalance: asset.getUSDValue(balance),
        asset,
      }
      this.setState({ data, err: null });
    } catch (err) {
      console.warn(err);
      this.setState({ err, data: null });
    }
  }

  render() {
    return this.props.render(this.state.err, this.state.data);
  }
}

export default withBurner(AccountBalance);
