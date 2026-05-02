import React, { useState } from "react";
import MobileHeader from "../../components/MobileHeader/MobileHeader";
import {
  RiPlayCircleLine,
  RiAddLine,
  RiCloseLine,
  RiSearchLine,
  RiYoutubeLine,
  RiTimeLine,
  RiWeightLine,
} from "react-icons/ri";
import Sidebar from "../../components/Sidebar/Sidebar";
import Footer from "../../components/Footer/Footer";
import VideoCard from "../../components/VideoCard/VideoCard";
import "./VideoSuggestions.css";

const TRUSTED_VIDEOS = [
  {
    id: 1,
    title: "Perfect Squat Form – Athlean-X",
    url: "https://www.youtube.com/embed/ultWZbUMPL8",
    category: "Legs",
    duration: "10 min",
    channel: "Athlean-X",
  },
  {
    id: 2,
    title: "How to Deadlift – Alan Thrall",
    url: "https://www.youtube.com/embed/wYREQkVtvEc",
    category: "Back",
    duration: "11 min",
    channel: "Alan Thrall",
  },
  {
    id: 3,
    title: "Perfect Push-Up – Jeff Cavaliere",
    url: "https://www.youtube.com/embed/IODxDxX7oi4",
    category: "Chest",
    duration: "8 min",
    channel: "Athlean-X",
  },
  {
    id: 4,
    title: "Pull-Up Tutorial for Beginners",
    url: "https://www.youtube.com/embed/eGo4IYlbE5g",
    category: "Back",
    duration: "9 min",
    channel: "FitnessFAQs",
  },
  {
    id: 5,
    title: "Overhead Press – Starting Strength",
    url: "https://www.youtube.com/embed/CnBmiBqp-AI",
    category: "Shoulders",
    duration: "7 min",
    channel: "Starting Strength",
  },
  {
    id: 6,
    title: "Barbell Curl Form – Jeff Nippard",
    url: "https://www.youtube.com/embed/kwG2ipFRgfo",
    category: "Arms",
    duration: "6 min",
    channel: "Jeff Nippard",
  },
  {
    id: 7,
    title: "Full Body Stretching (15 min)",
    url: "https://www.youtube.com/embed/UItWltVZZmE",
    category: "Mobility",
    duration: "15 min",
    channel: "MadFit",
  },
  {
    id: 8,
    title: "Bench Press – Complete Guide",
    url: "https://www.youtube.com/embed/vcBig73ojpE",
    category: "Chest",
    duration: "12 min",
    channel: "Jeff Nippard",
  },
  {
    id: 9,
    title: "6-Pack Abs Workout (No Equipment)",
    url: "https://www.youtube.com/embed/1f8yoFFdkcY",
    category: "Core",
    duration: "10 min",
    channel: "MadFit",
  },
];

const CATEGORIES = [
  "All",
  "Chest",
  "Back",
  "Legs",
  "Shoulders",
  "Arms",
  "Core",
  "Mobility",
];

const getThumb = (url) => {
  const match = url.match(/embed\/([^?]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/mqdefault.jpg` : null;
};

const VideoSuggestions = () => {
  const [videos, setVideos] = useState(TRUSTED_VIDEOS);
  const [activeVideo, setActiveVideo] = useState(null);
  const [activeCategory, setActiveCategory] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
  const [search, setSearch] = useState("");
  const [addForm, setAddForm] = useState({
    title: "",
    url: "",
    category: "Chest",
    duration: "",
    channel: "",
  });

  const toEmbed = (url) => {
    const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
    return m ? `https://www.youtube.com/embed/${m[1]}` : url;
  };

  const handleAdd = (e) => {
    e.preventDefault();
    setVideos((prev) => [
      {
        id: Date.now(),
        ...addForm,
        url: toEmbed(addForm.url),
      },
      ...prev,
    ]);
    setAddForm({
      title: "",
      url: "",
      category: "Chest",
      duration: "",
      channel: "",
    });
    setShowAddForm(false);
  };

  const filtered = videos.filter((v) => {
    const matchCat = activeCategory === "All" || v.category === activeCategory;
    const matchSearch =
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.channel?.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div className="page-layout">
      <Sidebar />
      <main className="page-content">
        <div className="page-header">
          <div>
            <h1 className="page-title">Video Library</h1>
            <p className="page-subtitle">
              Curated tutorials from trusted fitness channels.
            </p>
          </div>
          <button
            className="btn btn-accent"
            onClick={() => setShowAddForm(!showAddForm)}
          >
            {showAddForm ? (
              <>
                <RiCloseLine size={15} /> Cancel
              </>
            ) : (
              <>
                <RiAddLine size={15} /> Add Video
              </>
            )}
          </button>
        </div>

        {/* Active player */}
        {activeVideo && (
          <div className="vid-player-card card">
            <div className="vid-player-header">
              <div className="vid-player-info">
                <RiYoutubeLine size={18} className="vid-yt-icon" />
                <div>
                  <div className="vid-player-title">{activeVideo.title}</div>
                  {activeVideo.channel && (
                    <div className="vid-player-channel">
                      {activeVideo.channel}
                    </div>
                  )}
                </div>
              </div>
              <button
                className="btn btn-ghost vid-close-btn"
                onClick={() => setActiveVideo(null)}
              >
                <RiCloseLine size={16} /> Close
              </button>
            </div>
            <div className="vid-iframe-wrap">
              <iframe
                src={activeVideo.url + "?autoplay=1"}
                title={activeVideo.title}
                frameBorder="0"
                allow="autoplay; encrypted-media; fullscreen"
                allowFullScreen
                className="vid-iframe"
              />
            </div>
          </div>
        )}

        {/* Add form */}
        {showAddForm && (
          <div className="card vid-add-card">
            <h3 className="vid-add-title">
              <RiAddLine size={16} /> Add Custom Video
            </h3>
            <form onSubmit={handleAdd} className="vid-add-form">
              <div className="vid-add-grid">
                <div className="form-group vid-add-wide">
                  <label className="form-label">Video Title *</label>
                  <input
                    className="form-input"
                    value={addForm.title}
                    onChange={(e) =>
                      setAddForm((p) => ({ ...p, title: e.target.value }))
                    }
                    placeholder="e.g. How to Bench Press"
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Channel Name</label>
                  <input
                    className="form-input"
                    value={addForm.channel}
                    onChange={(e) =>
                      setAddForm((p) => ({ ...p, channel: e.target.value }))
                    }
                    placeholder="e.g. Athlean-X"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={addForm.category}
                    onChange={(e) =>
                      setAddForm((p) => ({ ...p, category: e.target.value }))
                    }
                  >
                    {CATEGORIES.filter((c) => c !== "All").map((c) => (
                      <option key={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Duration</label>
                  <input
                    className="form-input"
                    value={addForm.duration}
                    onChange={(e) =>
                      setAddForm((p) => ({ ...p, duration: e.target.value }))
                    }
                    placeholder="10 min"
                  />
                </div>
                <div className="form-group vid-add-full">
                  <label className="form-label">YouTube URL *</label>
                  <input
                    className="form-input"
                    value={addForm.url}
                    onChange={(e) =>
                      setAddForm((p) => ({ ...p, url: e.target.value }))
                    }
                    placeholder="https://youtube.com/watch?v=..."
                    required
                  />
                </div>
              </div>
              <div className="vid-add-actions">
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <RiAddLine size={14} /> Add Video
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Search + filter */}
        <div className="vid-controls">
          <div className="vid-search-wrap">
            <RiSearchLine size={15} className="vid-search-icon" />
            <input
              className="vid-search"
              placeholder="Search videos or channels…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="vid-cats">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                className={`vid-cat-btn ${activeCategory === c ? "vid-cat-btn--active" : ""}`}
                onClick={() => setActiveCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        <div className="vid-grid">
          {filtered.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: "1/-1" }}>
              <RiWeightLine size={28} className="empty-state-icon" />
              <div className="empty-state-text">No videos found.</div>
            </div>
          ) : (
            filtered.map((v) => {
              const ytId = v.url.match(/embed\/([^?]+)/)?.[1];
              const videoObj = {
                id: ytId,
                title: v.title,
                duration: v.duration,
                category: v.category,
                embedUrl: v.url,
                thumbUrl: ytId
                  ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
                  : null,
              };
              return (
                <div key={v.id} className="vid-card-wrap">
                  <VideoCard
                    video={videoObj}
                    onPlay={() => setActiveVideo(v)}
                  />
                  {v.id > 9 && (
                    <button
                      className="vid-remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        setVideos((p) => p.filter((x) => x.id !== v.id));
                        if (activeVideo?.id === v.id) setActiveVideo(null);
                      }}
                    >
                      <RiCloseLine size={13} />
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        <div className="vid-ai-note">
          <RiWeightLine size={14} /> AI-powered video recommendations based on
          your workout plan — coming soon.
        </div>

        <Footer />
      </main>
    </div>
  );
};

export default VideoSuggestions;
