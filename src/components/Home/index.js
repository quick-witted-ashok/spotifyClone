import { Component } from "react";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";

const apiStatusConstants = {
  initial: "INITIAL",
  success: "SUCCESS",
  failure: "FAILURE",
  inProgress: "IN_PROGRESS",
};

class Home extends Component {
  state = {
    featuredList: [],
    apiStatus: apiStatusConstants.initial,
    api: "",
  };

  componentDidMount() {
    this.getPlayList();
  }

  getPlayList = async () => {
    this.setState({
      apiStatus: apiStatusConstants.inProgress,
    });

    const jwtToken = Cookies.get("jwt_token");

    const apiUrl = "https://apis2.ccbp.in/spotify-clone/featured-playlists";
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: "GET",
    };
    const response = await fetch(apiUrl, options);
    if (response.ok === true) {
      const fetchedData = await response.json();
      console.log(fetchedData.message);
      const { playlists } = fetchedData;
      console.log(playlists.items);
      const updatedData = fetchedData.playlists.items.map((product) => ({
        description: product.description,
        images: product.images[0].url,
        id: product.id,
        tracks: product.tracks.href,
        name: product.name,
        href: product.href,
        external_urls: product.external_urls,
      }));
      this.setState({
        featuredList: updatedData,
        apiStatus: apiStatusConstants.success,
        api: updatedData[0].href,
      });
      console.log(fetchedData);
    } else if (response.status === 401) {
      this.setState({
        apiStatus: apiStatusConstants.failure,
      });
    }
  };

  renderList = () => {
    const { featuredList } = this.state;

    return (
      <div>
        <ul>
          {featuredList.map((eachItem) => (
            <Link to={`/playlist/:${eachItem.id}`}>
              <li key={eachItem.id}>
                <div>
                  <img src={eachItem.images} alt={eachItem.description} />
                  <p>{eachItem.name}</p>
                </div>
              </li>
            </Link>
          ))}
        </ul>
      </div>
    );
  };

  renderFailureView = () => <img src="" alt="failure" />;

  renderLoadingView = () => (
    <div className="products-loader-container">
      <h1>Loading...</h1>
    </div>
  );

  //   getLists = async () => {
  //     const { api } = this.state;
  //     const jwtToken = Cookies.get("jwt_token");

  //     const options = {
  //       headers: {
  //         Authorization: `Bearer ${jwtToken}`,
  //       },
  //       method: "GET",
  //     };

  //     const apiData = await fetch(api, options);

  //     const listData = await apiData.json();

  //     console.log(listData);
  //     console.log("ASHOk");
  //     return listData;
  //   };

  render() {
    // this.getLists();
    const { apiStatus } = this.state;
    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderList();
      case apiStatusConstants.failure:
        return this.renderFailureView();
      case apiStatusConstants.inProgress:
        return this.renderLoadingView();
      default:
        return null;
    }
  }
}

export default Home;
