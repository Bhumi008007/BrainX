import React, {
  useEffect,
  useState,
} from "react";

import brainxLogo
  from "../assets/brainx-logo.png";

const Community = () => {
  const [images, setImages] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  // ==========================================
  // LOAD COMMUNITY IMAGES
  // ==========================================

  const loadCommunityImages =
    async () => {
      try {
        setLoading(true);
        setError("");

        const serverURL =
          import.meta.env
            .VITE_SERVER_URL ||
          "http://localhost:5000";

        const response =
          await fetch(
            `${serverURL}/api/image/community`
          );

        const data =
          await response.json();

        if (!response.ok) {
          throw new Error(
            data.message ||
              "Unable to load community images."
          );
        }

        setImages(
          data.images || []
        );
      } catch (error) {
        console.error(
          "Community Error:",
          error
        );

        setError(
          "BrainX could not load community images."
        );
      } finally {
        setLoading(false);
      }
    };

  // ==========================================
  // INITIAL LOAD
  // ==========================================

  useEffect(() => {
    loadCommunityImages();
  }, []);

  // ==========================================
  // FORMAT DATE
  // ==========================================

  const formatDate = (
    dateValue
  ) => {
    if (!dateValue) {
      return "";
    }

    return new Date(
      dateValue
    ).toLocaleDateString(
      undefined,
      {
        day: "numeric",
        month: "short",
        year: "numeric",
      }
    );
  };

  // ==========================================
  // UI
  // ==========================================

  return (
    <section
      className="
        h-full
        overflow-y-auto

        bg-[#f8f9fd]
        dark:bg-[#111019]
      "
    >

      {/* =====================================
          HEADER
      ====================================== */}

      <header
        className="
          sticky
          top-0
          z-10

          border-b
          border-gray-200/70
          dark:border-white/5

          bg-white/80
          dark:bg-[#15131d]/85

          backdrop-blur-xl

          px-5
          md:px-10

          py-5
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto

            flex
            items-center
            justify-between

            gap-4
          "
        >

          <div>

            <span
              className="
                text-[10px]
                font-semibold

                tracking-[0.18em]

                text-primary
                uppercase
              "
            >
              BrainX Gallery
            </span>

            <h1
              className="
                text-2xl
                md:text-3xl

                font-semibold
                tracking-tight

                mt-1
              "
            >
              Community Creations
            </h1>

            <p
              className="
                text-sm

                text-gray-500
                dark:text-gray-400

                mt-1
              "
            >
              Discover visuals created by the BrainX community.
            </p>

          </div>

          <button
            onClick={
              loadCommunityImages
            }
            className="
              px-4
              py-2.5

              rounded-xl

              border
              border-gray-200
              dark:border-white/10

              bg-white
              dark:bg-white/5

              hover:border-violet-300
              hover:text-primary

              text-sm
              font-medium

              shadow-sm

              transition
            "
          >
            ↻ Refresh
          </button>

        </div>

      </header>

      {/* =====================================
          CONTENT
      ====================================== */}

      <div
        className="
          max-w-7xl
          mx-auto

          px-5
          md:px-10

          py-8
        "
      >

        {/* =====================================
            LOADING
        ====================================== */}

        {loading && (
          <div
            className="
              min-h-[60vh]

              flex
              flex-col
              items-center
              justify-center

              text-center
            "
          >

            <div
              className="
                w-20
                h-20

                rounded-[24px]

                bg-white
                dark:bg-[#211e2a]

                border
                border-gray-200
                dark:border-white/10

                shadow-lg

                flex
                items-center
                justify-center
              "
            >

              <img
                src={brainxLogo}
                alt="BrainX"
                className="
                  w-16
                  h-16

                  object-contain

                  animate-pulse
                "
              />

            </div>

            <p
              className="
                mt-4

                text-sm
                text-gray-500
              "
            >
              Loading community creations...
            </p>

          </div>
        )}

        {/* =====================================
            ERROR
        ====================================== */}

        {!loading &&
          error && (
            <div
              className="
                min-h-[60vh]

                flex
                flex-col

                items-center
                justify-center

                text-center
              "
            >

              <div
                className="
                  w-16
                  h-16

                  rounded-2xl

                  bg-amber-50
                  dark:bg-amber-500/10

                  flex
                  items-center
                  justify-center

                  text-3xl
                "
              >
                ⚠️
              </div>

              <h2
                className="
                  text-xl
                  font-semibold

                  mt-4
                "
              >
                Unable to load images
              </h2>

              <p
                className="
                  text-sm
                  text-gray-500

                  mt-2
                "
              >
                {error}
              </p>

              <button
                onClick={
                  loadCommunityImages
                }
                className="
                  mt-5

                  px-5
                  py-2.5

                  rounded-xl

                  bg-primary
                  text-white

                  text-sm
                  font-medium
                "
              >
                Try Again
              </button>

            </div>
          )}

        {/* =====================================
            EMPTY
        ====================================== */}

        {!loading &&
          !error &&
          images.length ===
            0 && (
            <div
              className="
                min-h-[60vh]

                flex
                flex-col

                items-center
                justify-center

                text-center
              "
            >

              <div
                className="
                  w-24
                  h-24

                  rounded-3xl

                  bg-white
                  dark:bg-[#211e2a]

                  border
                  border-gray-200
                  dark:border-white/10

                  shadow-sm

                  flex
                  items-center
                  justify-center

                  text-4xl
                "
              >
                🖼️
              </div>

              <h2
                className="
                  text-xl
                  font-semibold

                  mt-5
                "
              >
                No community images yet
              </h2>

              <p
                className="
                  max-w-md

                  text-sm

                  text-gray-500
                  dark:text-gray-400

                  mt-2
                "
              >
                Generate an image in BrainX and your public creation will appear here.
              </p>

            </div>
          )}

        {/* =====================================
            IMAGE GRID
        ====================================== */}

        {!loading &&
          !error &&
          images.length > 0 && (
            <>

              <div
                className="
                  flex
                  items-center
                  justify-between

                  mb-6
                "
              >

                <div>

                  <p
                    className="
                      text-sm
                      font-medium
                    "
                  >
                    {images.length}{" "}
                    {images.length ===
                    1
                      ? "creation"
                      : "creations"}
                  </p>

                  <p
                    className="
                      text-xs
                      text-gray-400

                      mt-1
                    "
                  >
                    Latest AI-generated visuals from the community
                  </p>

                </div>

              </div>

              <div
                className="
                  grid

                  grid-cols-1
                  sm:grid-cols-2
                  lg:grid-cols-3
                  xl:grid-cols-4

                  gap-6
                "
              >

                {images.map(
                  (image) => (
                    <article
                      key={
                        image._id
                      }
                      className="
                        group

                        overflow-hidden

                        rounded-3xl

                        bg-white
                        dark:bg-[#1b1823]

                        border
                        border-gray-200/80
                        dark:border-white/10

                        shadow-sm

                        hover:shadow-xl
                        hover:-translate-y-1

                        transition-all
                        duration-300
                      "
                    >

                      {/* IMAGE */}

                      <div
                        className="
                          aspect-square

                          overflow-hidden

                          bg-gray-100
                          dark:bg-white/5

                          relative
                        "
                      >

                        <img
                          src={
                            image.imageUrl
                          }
                          alt={
                            image.prompt ||
                            "BrainX Generated Image"
                          }
                          loading="lazy"
                          className="
                            w-full
                            h-full

                            object-cover

                            group-hover:scale-105

                            transition-transform
                            duration-500
                          "
                        />

                        <div
                          className="
                            absolute

                            top-3
                            right-3

                            px-2.5
                            py-1

                            rounded-full

                            bg-black/45

                            backdrop-blur-md

                            text-white
                            text-[9px]
                            font-semibold
                          "
                        >
                          ✦ AI GENERATED
                        </div>

                      </div>

                      {/* DETAILS */}

                      <div className="p-4">

                        <p
                          className="
                            text-sm
                            font-medium

                            leading-6

                            line-clamp-2
                          "
                        >
                          {image.prompt}
                        </p>

                        <div
                          className="
                            flex
                            items-center
                            justify-between

                            gap-3

                            mt-4
                            pt-4

                            border-t
                            border-gray-100
                            dark:border-white/5
                          "
                        >

                          <div
                            className="
                              flex
                              items-center
                              gap-2

                              min-w-0
                            "
                          >

                            <div
                              className="
                                w-8
                                h-8

                                rounded-xl

                                bg-gradient-to-br
                                from-violet-100
                                to-cyan-100

                                dark:from-violet-500/10
                                dark:to-cyan-500/10

                                flex
                                items-center
                                justify-center

                                shrink-0
                              "
                            >

                              <span
                                className="
                                  text-primary
                                  text-xs
                                  font-bold
                                "
                              >
                                {image.user
                                  ?.name
                                  ?.charAt(
                                    0
                                  )
                                  ?.toUpperCase() ||
                                  "B"}
                              </span>

                            </div>

                            <div
                              className="
                                min-w-0
                              "
                            >

                              <p
                                className="
                                  text-xs
                                  font-medium

                                  truncate
                                "
                              >
                                {image.user
                                  ?.name ||
                                  "BrainX User"}
                              </p>

                              <p
                                className="
                                  text-[10px]
                                  text-gray-400
                                "
                              >
                                {formatDate(
                                  image.createdAt
                                )}
                              </p>

                            </div>

                          </div>

                          <span
                            className="
                              text-gray-300

                              group-hover:text-primary

                              transition
                            "
                          >
                            ↗
                          </span>

                        </div>

                      </div>

                    </article>
                  )
                )}

              </div>

            </>
          )}

      </div>

    </section>
  );
};

export default Community;