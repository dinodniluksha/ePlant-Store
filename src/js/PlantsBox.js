import React, { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  startAfter,
  endBefore,
  limit,
  limitToLast,
  orderBy,
} from "firebase/firestore";
import { db } from "../firebase";
import FadeLoader from "react-spinners/FadeLoader";
import pageLoader from "../assets/loaders/loading-3.gif";
import itemLoader from "../assets/loaders/loading.gif";
import CustomIcon from "../components/CustomIcon";
import ProgressiveImage from "react-progressive-graceful-image";

let startId = "A-0";
let lastId = "ZZZZZZ-999999";
let forwardId = startId;
let backwardId = lastId;

const PlantsBox = () => {
  let plantData = [];

  const setInitialDisplayCount = () => {
    let displayCount = 0;
    let xCount = 0;
    let yCount = 0;
    let w = window.innerWidth;
    let h = window.innerHeight;
    console.log("Window width" + window.innerWidth);
    console.log("Window height" + window.innerHeight);
    if (w >= 1200) {
      xCount = 4;
      yCount = Math.trunc((h - 136.4) / 291.85);
      displayCount = xCount * yCount;
    } else if (w >= 992) {
      xCount = 3;
      yCount = Math.trunc((h - 136.4) / 263.7);
      displayCount = xCount * yCount;
    } else if (w >= 768) {
      xCount = 3;
      yCount = Math.trunc((h - 136.4) / 236.68);
      displayCount = xCount * yCount;
    } else if (w >= 470) {
      xCount = 3;
      yCount = Math.trunc((h - 136.4) / 222.11);
      displayCount = xCount * yCount;
    } else if (w >= 317) {
      xCount = 2;
      yCount = Math.trunc((h - 136.4) / 222.11);
      displayCount = xCount * yCount;
    } else {
      xCount = 1;
      yCount = Math.trunc((h - 136.4) / 202.91);
      displayCount = xCount * yCount;
    }
    return displayCount;
  };

  let [plants, setPlants] = useState([]);
  let [displayCount, setDisplayCount] = useState(() =>
    setInitialDisplayCount()
  );

  const fetchForward = async () => {
    console.log("Call API to fill plant array...");
    console.log("Detected Display Size..." + displayCount);

    let p = query(
      collection(db, "plants"),
      where("isVisible", "==", true),
      orderBy("id"),
      startAfter(forwardId),
      limit(displayCount)
    );
    onSnapshot(p, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        forwardId = doc.data().id;
        plantData.push(doc.data());
      });
      console.log("Fetched plants: ", plantData);
      console.log("Last ID of fetched car: " + forwardId);

      if (forwardId === lastId) {
        forwardId = startId;
        plantData.pop();
        let remainCount = displayCount - plantData.length;
        let q = query(
          collection(db, "plants"),
          where("isVisible", "==", true),
          orderBy("id"),
          startAfter(forwardId),
          limit(remainCount)
        );
        onSnapshot(q, (querySnapshot) => {
          querySnapshot.forEach((doc) => {
            forwardId = doc.data().id;
            plantData.push(doc.data());
          });
          backwardId = plantData[0].id;
          setPlants(plantData);
          plantData = [];
        });
      } else {
        backwardId = plantData[0].id;
        setPlants(plantData);
        plantData = [];
      }
    });
  };

  const fetchBackward = async () => {
    console.log("Call fetchBackward to fill plant array..." + backwardId);

    let p = query(
      collection(db, "plants"),
      where("isVisible", "==", true),
      orderBy("id", "asc"),
      endBefore(backwardId),
      limitToLast(displayCount)
    );
    onSnapshot(p, (querySnapshot) => {
      querySnapshot.forEach((doc) => {
        plantData.unshift(doc.data());
      });
      //console.log('=========>>>>>> plants: ' + JSON.stringify(plantData));
      backwardId = plantData[plantData.length - 1].id;
      //console.log("Fetched plants start: ", plantData[0]);
      console.log("Last ID of fetched car: " + backwardId);

      if (backwardId === startId) {
        backwardId = lastId;
        plantData.pop();
        let remainCount = displayCount - plantData.length;
        console.log("backwardId: " + backwardId);
        console.log("remainCount: " + remainCount);
        let q = query(
          collection(db, "plants"),
          where("isVisible", "==", true),
          orderBy("id", "asc"),
          endBefore(backwardId),
          limitToLast(remainCount)
        );
        onSnapshot(q, (querySnapshot) => {
          let tempRack = [];
          querySnapshot.forEach((doc) => {
            tempRack.unshift(doc.data());
          });
          tempRack.forEach((item) => {
            plantData.push(item);
          });
          // console.log('=========>>>>>> plants: ' + JSON.stringify(tempRack));
          backwardId = plantData[plantData.length - 1].id;
          forwardId = plantData[0].id;
          setPlants(plantData);
          plantData = [];
        });
      } else {
        forwardId = plantData[0].id;
        setPlants(plantData);
        plantData = [];
      }
    });
  };

  const detectdisplaySize = () => {
    console.log("Detecting Display Size...");
    let xCount = 0;
    let yCount = 0;
    let w = window.innerWidth;
    let h = window.innerHeight;
    console.log("Window width" + window.innerWidth);
    console.log("Window height" + window.innerHeight);

    if (w >= 1200) {
      xCount = 4;
      yCount = Math.trunc((h - 136.4) / 291.85);
      setDisplayCount(xCount * yCount);
    } else if (w >= 992) {
      xCount = 3;
      yCount = Math.trunc((h - 136.4) / 283.7);
      setDisplayCount(xCount * yCount);
    } else if (w >= 768) {
      xCount = 3;
      yCount = Math.trunc((h - 136.4) / 236.68);
      setDisplayCount(xCount * yCount);
    } else if (w >= 470) {
      xCount = 3;
      yCount = Math.trunc((h - 136.4) / 222.11);
      setDisplayCount(xCount * yCount);
    } else if (w >= 317) {
      xCount = 2;
      yCount = Math.trunc((h - 136.4) / 222.11);
      setDisplayCount(xCount * yCount);
    } else {
      xCount = 1;
      yCount = Math.trunc((h - 136.4) / 202.91);
      setDisplayCount(xCount * yCount);
    }
  };

  useEffect(() => {
    fetchForward();
    window.addEventListener("resize", detectdisplaySize);

    return () => {
      window.removeEventListener("resize", detectdisplaySize);
    }; //eslint-disable-next-line
  }, [displayCount]);

  function goForward() {
    fetchForward();
  }
  function goBackward() {
    fetchBackward();
  }

  const forwardBtn = document.getElementById("rightBtn");
  forwardBtn.onclick = goForward;
  forwardBtn.style.visibility = "hidden";
  const backwardBtn = document.getElementById("leftBtn");
  backwardBtn.onclick = goBackward;
  backwardBtn.style.visibility = "hidden";

  if (plants.length !== 0) {
    forwardBtn.style.visibility = "visible";
    backwardBtn.style.visibility = "visible";
  }

  return plants.length !== 0 ? (
    <>
      {plants.map((plant, k) => (
        <div class="box">
          <a href="">
            <div class="img-box">
              <ProgressiveImage src={plant.imageUrl} placeholder={itemLoader}>
                {(src) => <img src={src} alt="" />}
              </ProgressiveImage>
            </div>
            <div class="detail-box">
              <h6 class="price">Rs 840.00</h6>
              <h6>{plant.name}</h6>
            </div>
          </a>
        </div>
      ))}
    </>
  ) : (
    <img class="loader-box" src={pageLoader} alt="loading..." />
  );
};

export default PlantsBox;
