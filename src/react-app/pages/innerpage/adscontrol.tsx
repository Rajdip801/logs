import GridAdsManager from "../../components/gridadsmanager";
import FlatAdsManager from "../../components/flatads";
import "../../style/adscontrol.css";
export default function Adscontrol () {
    return (
        <div className="ads-control-page">
            <div className="flatads">
                <FlatAdsManager />
            </div>
            <div className="line"></div>
            <div className="gridads">
                <GridAdsManager />
            </div>
            {/* Add any additional components or content for the Ads Control page here */}
        </div>
    );
}