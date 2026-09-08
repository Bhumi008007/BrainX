import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import moment from "moment";

import { useAppContext } from "../context/AppContext";
import brainxLogo from "../assets/brainx-logo.png";

// ==========================================
// GENERATED IMAGE
// ==========================================

const GeneratedImage = ({ src, alt }) => {
  const [imageSrc, setImageSrc] = useState(src);
  const [loading, setLoading] = useState(true);
  const [retryCount, setRetryCount] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    setImageSrc(src);
    setLoading(true);
    setRetryCount(0);
    setFailed(false);
  }, [src]);

  const handleLoad = () => {
    setLoading(false);
    setFailed(false);
  };

  const handleError = () => {
    if (retryCount >= 12) {
      setLoading(false);
      setFailed(true);
      return;
    }

    setLoading(true);

    const nextRetry =
      retryCount + 1;

    setRetryCount(nextRetry);

    setTimeout(() => {
      // Retry same ImageKit generation.
      // Hash is not sent to ImageKit server.
      setImageSrc(
        `${src}#brainx-retry-${Date.now()}`
      );
    }, 5000);
  };

  return (
    <div className="my-4">

      {/* IMAGE LOADING */}

      {loading && !failed && (
        <div
          className="
            relative
            w-full
            max-w-xl
            min-h-[260px]
            rounded-3xl
            overflow-hidden
            border
            border-gray-200
            dark:border-white/10

            bg-gradient-to-br
            from-gray-50
            via-violet-50
            to-cyan-50

            dark:from-[#191721]
            dark:via-[#211a2e]
            dark:to-[#172129]

            flex
            flex-col
            items-center
            justify-center
            gap-4
            p-6
          "
        >

          <div
            className="
              absolute
              w-44
              h-44
              rounded-full
              bg-violet-400/20
              blur-3xl
              -top-10
              -right-10
            "
          />

          <div
            className="
              relative
              w-16
              h-16
              rounded-2xl

              bg-white
              dark:bg-white/5

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
                w-11
                h-11
                object-contain
                animate-pulse
              "
            />
          </div>

          <div className="relative flex gap-2">

            <span
              className="
                w-2
                h-2
                rounded-full
                bg-primary
                animate-bounce
              "
            />

            <span
              className="
                w-2
                h-2
                rounded-full
                bg-primary
                animate-bounce
                [animation-delay:120ms]
              "
            />

            <span
              className="
                w-2
                h-2
                rounded-full
                bg-primary
                animate-bounce
                [animation-delay:240ms]
              "
            />

          </div>

          <div className="relative text-center">

            <p className="text-sm font-medium">
              Creating your image
            </p>

            <p
              className="
                text-xs
                text-gray-500
                dark:text-gray-400
                mt-1
              "
            >
              {retryCount > 0
                ? "ImageKit is preparing the final image..."
                : "BrainX is generating your visual."}
            </p>

          </div>

        </div>
      )}

      {/* GENERATED IMAGE */}

      {!failed && (
        <img
          src={imageSrc}
          alt={
            alt ||
            "BrainX Generated Image"
          }
          onLoad={handleLoad}
          onError={handleError}
          className={`
            max-w-full
            md:max-w-xl

            rounded-3xl

            border
            border-gray-200
            dark:border-white/10

            shadow-xl

            object-contain

            ${
              loading
                ? "hidden"
                : "block"
            }
          `}
        />
      )}

      {/* FAILED IMAGE */}

      {failed && (
        <div
          className="
            max-w-xl

            rounded-2xl

            border
            border-amber-200
            dark:border-amber-500/20

            bg-amber-50
            dark:bg-amber-500/5

            p-5
          "
        >

          <p className="text-sm font-medium">
            The image is taking longer than expected.
          </p>

          <p
            className="
              text-xs
              text-gray-500
              dark:text-gray-400
              mt-1
            "
          >
            Try loading the generated image again.
          </p>

          <button
            type="button"
            onClick={() => {
              setFailed(false);
              setLoading(true);
              setRetryCount(0);

              setImageSrc(
                `${src}#brainx-retry-${Date.now()}`
              );
            }}
            className="
              mt-3
              text-xs
              font-medium
              text-primary
              hover:underline
            "
          >
            Try loading again
          </button>

        </div>
      )}

    </div>
  );
};

// ==========================================
// MESSAGE
// ==========================================

const Message = ({ message }) => {
  const { user } =
    useAppContext();

  const [copied, setCopied] =
    useState(false);

  const isUser =
    message.role === "user";

  // ========================================
  // COPY RESPONSE
  // ========================================

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(
        message.content
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 1500);
    } catch (error) {
      console.error(
        "Copy Error:",
        error
      );
    }
  };

  return (
    <div
      className={`
        group
        flex
        gap-3
        my-6

        ${
          isUser
            ? "justify-end"
            : "justify-start"
        }
      `}
    >

      {/* =====================================
          AI AVATAR
      ====================================== */}

      {!isUser && (
        <div
          className="
            w-10
            h-10

            shrink-0

            rounded-xl

            bg-white
            dark:bg-[#211e2a]

            border
            border-gray-200
            dark:border-white/10

            shadow-sm

            flex
            items-center
            justify-center
          "
        >
          <img
            src={brainxLogo}
            alt="BrainX"
            className="
              w-8
              h-8
              object-contain
            "
          />
        </div>
      )}

      {/* =====================================
          MESSAGE CONTENT
      ====================================== */}

      <div
        className={`
          max-w-[88%]
          md:max-w-[78%]

          flex
          flex-col

          ${
            isUser
              ? "items-end"
              : "items-start"
          }
        `}
      >

        <div
          className={`
            px-4
            md:px-5

            py-3.5

            text-sm
            leading-7

            shadow-sm

            ${
              isUser
                ? `
                  bg-gradient-to-br
                  from-violet-600
                  to-indigo-600

                  text-white

                  rounded-[22px]
                  rounded-tr-md
                `
                : `
                  bg-white
                  dark:bg-[#1c1924]

                  border
                  border-gray-200/80
                  dark:border-white/10

                  rounded-[22px]
                  rounded-tl-md
                `
            }
          `}
        >

          <ReactMarkdown
            remarkPlugins={[
              remarkGfm,
            ]}
            components={{

              img: ({
                src,
                alt,
              }) => (
                <GeneratedImage
                  src={src}
                  alt={alt}
                />
              ),

              p: ({
                children,
              }) => (
                <p className="mb-2 last:mb-0">
                  {children}
                </p>
              ),

              h1: ({
                children,
              }) => (
                <h1 className="text-xl font-semibold mt-4 mb-2">
                  {children}
                </h1>
              ),

              h2: ({
                children,
              }) => (
                <h2 className="text-lg font-semibold mt-4 mb-2">
                  {children}
                </h2>
              ),

              h3: ({
                children,
              }) => (
                <h3 className="text-base font-semibold mt-3 mb-2">
                  {children}
                </h3>
              ),

              ul: ({
                children,
              }) => (
                <ul
                  className="
                    list-disc
                    pl-5
                    space-y-1
                    my-2
                  "
                >
                  {children}
                </ul>
              ),

              ol: ({
                children,
              }) => (
                <ol
                  className="
                    list-decimal
                    pl-5
                    space-y-1
                    my-2
                  "
                >
                  {children}
                </ol>
              ),

              blockquote: ({
                children,
              }) => (
                <blockquote
                  className="
                    border-l-2
                    border-primary/60

                    pl-3
                    my-3

                    italic
                  "
                >
                  {children}
                </blockquote>
              ),

              a: ({
                href,
                children,
              }) => (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`
                    underline
                    underline-offset-2

                    ${
                      isUser
                        ? "text-white"
                        : "text-primary"
                    }
                  `}
                >
                  {children}
                </a>
              ),

              code: ({
                children,
              }) => (
                <code
                  className="
                    bg-black/10
                    dark:bg-black/30

                    px-1.5
                    py-0.5

                    rounded-md

                    text-[0.92em]
                  "
                >
                  {children}
                </code>
              ),

            }}
          >
            {message.content}
          </ReactMarkdown>

        </div>

        {/* =====================================
            MESSAGE INFO
        ====================================== */}

        <div
          className="
            flex
            items-center
            gap-2

            mt-1.5
            px-1

            text-[10px]
            text-gray-400
          "
        >

          <span>
            {moment(
              message.timestamp
            ).format(
              "hh:mm A"
            )}
          </span>

          {!isUser && (
            <>
              <span>•</span>

              <button
                onClick={copy}
                className="
                  opacity-70
                  group-hover:opacity-100

                  hover:text-primary

                  transition
                "
              >
                {copied
                  ? "✓ Copied"
                  : "Copy"}
              </button>
            </>
          )}

          {isUser && (
            <>
              <span>•</span>

              <span>
                {user?.name ||
                  "You"}
              </span>
            </>
          )}

        </div>

      </div>

      {/* =====================================
          USER AVATAR
      ====================================== */}

      {isUser && (
        <div
          className="
            w-10
            h-10

            shrink-0

            rounded-xl

            bg-gradient-to-br
            from-violet-600
            to-indigo-600

            text-white

            flex
            items-center
            justify-center

            text-xs
            font-semibold

            shadow-sm
          "
        >
          {(user?.name || "Y")
            .charAt(0)
            .toUpperCase()}
        </div>
      )}

    </div>
  );
};

export default Message;