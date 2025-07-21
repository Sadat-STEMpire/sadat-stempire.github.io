document.addEventListener('DOMContentLoaded', function () {
    // Get all links in the concept list
    const links = document.querySelectorAll('.concept-list a');

    // Add click event listener to each link
    links.forEach(link => {
        link.addEventListener('click', function (event) {
            // Removed: event.preventDefault();

            // Hide all concept content
            document.querySelectorAll('.concept-content').forEach(content => {
                content.style.display = 'none';
            });

            // Show the targeted content
            const targetId = this.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.style.display = 'block';
            }
        });
    });
});

function checkAnswers(blockId) {
    const questionBlock = document.getElementById(blockId);
    const questions = questionBlock.querySelectorAll('.question');
    let score = 0;
    const totalQuestions = questions.length;

    questions.forEach(question => {
        const correctAnswer = question.getAttribute('data-correct');
        const selected = question.querySelector(`input[name="${question.querySelector('input').name}"]:checked`);
        const choices = question.querySelectorAll('.choices label');
        const resultElement = question.querySelector('.result');

        choices.forEach(choice => {
            choice.classList.remove('correct', 'incorrect');
            const radio = choice.querySelector('input[type="radio"]');
            if (radio.checked) {
                if (radio.value === correctAnswer) {
                    choice.classList.add('correct');
                    score++;
                } else {
                    choice.classList.add('incorrect');
                }
            } else if (radio.value === correctAnswer) {
                choice.classList.add('correct');
            }
        });

        if (selected) {
            if (selected.value === correctAnswer) {
                resultElement.innerHTML = `<span class="correct">Correct! ${selected.nextSibling.textContent.trim()}</span>`;
            } else {
                resultElement.innerHTML = `<span class="incorrect">Incorrect. The correct answer is ${question.querySelector('input[value="' + correctAnswer + '"]').nextSibling.textContent.trim()}</span>`;
            }
        } else {
            resultElement.innerHTML = `<span class="incorrect">No answer selected.</span>`;
        }
    });

    questionBlock.querySelector('.score').innerHTML = `Your Score: ${score} / ${totalQuestions}`;
}

document.addEventListener('DOMContentLoaded', function () {
    const links = document.querySelectorAll('a[data-target]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            // Removed: e.preventDefault();
            const targetId = this.getAttribute('data-target');
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
});

function showOnlySection(sectionId) {
    // Hide all sections first
    let sections = document.querySelectorAll('.new-section');
    sections.forEach(section => {
        section.style.display = 'none';
        section.classList.remove('active');
    });

    // Show the selected section
    let sectionToShow = document.getElementById(sectionId);
    sectionToShow.style.display = 'block';
    setTimeout(() => {
        sectionToShow.classList.add('active');
    }, 10); // Adding a slight delay to ensure smooth transition
}

// Ensure all sections are hidden when the page loads
window.onload = function () {
    let sections = document.querySelectorAll('.new-section');
    sections.forEach(section => section.style.display = 'none');
}

// Select the menulist and set its initial state as collapsed
let menulist = document.getElementById("menulist");
menulist.style.maxHeight = "0px"; // Initial state is collapsed

// Function to toggle the menu
function toggleMenu() {
    if (menulist.style.maxHeight == "0px" || getComputedStyle(menulist).maxHeight === "0px") {
        menulist.style.maxHeight = "300px"; // Expand the menu
    } else {
        menulist.style.maxHeight = "0px"; // Collapse the menu
    }
}

// Close the menu when clicking outside
window.addEventListener('click', function (event) {
    const menuIcon = document.querySelector(".menu-icon i");

    // Check if the click happened outside the menu and the menu icon
    if (!menulist.contains(event.target) && !menuIcon.contains(event.target)) {
        menulist.style.maxHeight = "0px"; // Collapse the menu
    }
});

// Prevent the event from propagating when clicking the menu icon
document.querySelector('.menu-icon').addEventListener('click', function (event) {
    event.stopPropagation(); // Prevents closing the menu when the menu icon is clicked
});

const apiKey = 'AIzaSyAbOuIseHHX1i0gGeEDJiSxD1yswLjZCUI';

async function fetchPlaylistVideos(playlistId, pageToken = '') {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=50&playlistId=${playlistId}&key=${apiKey}&pageToken=${pageToken}`);
    return response.json();
}

async function loadPlaylist() {
    const container = document.getElementById('videoContainer');
    const playlistId = container.dataset.playlistId;
    if (!playlistId) {
        container.innerHTML = '❌ Playlist ID not found!';
        return;
    }

    container.innerHTML = ''; // clear loading

    let nextPageToken = '';

    do {
        const data = await fetchPlaylistVideos(playlistId, nextPageToken);

        data.items.forEach(item => {
            const videoId = item.snippet.resourceId.videoId;
            const title = item.snippet.title;

            const videoBox = document.createElement('div');
            videoBox.className = 'video-box';
            videoBox.innerHTML = `
                <div class="video-title">${title}</div>
                <iframe src="https://www.youtube.com/embed/${videoId}" allowfullscreen></iframe>
            `;
            container.appendChild(videoBox);
        });

        nextPageToken = data.nextPageToken;
    } while (nextPageToken);
}

loadPlaylist();

/**
 * Script to play/pause the video using the controls.
 * This script is used in the hero video area.
 */
const video = document.getElementById('hero-video');

function togglePlayPause() {
    if (video.paused) {
        video.play();
        controls.setAttribute('aria-label', 'Pause');
    } else {
        video.pause();
        controls.setAttribute('aria-label', 'Play');
    }
}

const controls = document.getElementById('Play_Pause');
if (controls) {
    controls.addEventListener('click', togglePlayPause);

    // Add keyboard accessibility
    controls.addEventListener('keydown', function (event) {
        if (event.key === 'Enter' || event.key === ' ') {
            togglePlayPause();
            event.preventDefault();
        }
    });

    // Add ARIA attributes for accessibility
    controls.setAttribute('role', 'button');
    controls.setAttribute('aria-label', 'Play');

    // Update ARIA attributes when the video state changes
    video.addEventListener('play', function () {
        controls.setAttribute('aria-label', 'Pause');
        controls.classList.remove('paused');
        controls.classList.add('playing');
    });

    video.addEventListener('pause', function () {
        controls.setAttribute('aria-label', 'Play');
        controls.classList.remove('playing');
        controls.classList.add('paused');
    });
}

const GOOGLE_API_KEY = "AIzaSyAbOuIseHHX1i0gGeEDJiSxD1yswLjZCUI";

async function getFolderFiles(folderId) {
    const url = `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${GOOGLE_API_KEY}&fields=files(id,name,mimeType,webViewLink)`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.files || [];
    } catch (error) {
        console.error("Error fetching files:", error);
        return [];
    }
}

async function renderFiles() {
    const container = document.getElementById("file-container");
    const folderId = container.dataset.folderId;

    if (!folderId) {
        container.innerHTML = "<p>Folder ID not specified.</p>";
        return;
    }

    let files = await getFolderFiles(folderId);

    if (files.length === 0) {
        container.innerHTML = "<p>No files found.</p>";
        return;
    }

    // Sort files alphabetically by name
    files.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

    for (const file of files) {
        const { id, name, webViewLink, mimeType } = file;

        const card = document.createElement("div");
        card.className = "file-card";

        let previewHTML = "";
        if (mimeType.includes("pdf") || mimeType.includes("presentation") || mimeType.includes("document")) {
            previewHTML = `<iframe class="pdf-preview" src="https://drive.google.com/file/d/${id}/preview" allow="autoplay"></iframe>`;
        } else {
            previewHTML = `<p>(Preview not supported)</p>`;
        }

        const displayName = name.replace(/\.[^/.]+$/, "");  // Remove file extension

        card.innerHTML = `
            <h3 class="file-name">
                <a href="${webViewLink}" target="_blank" rel="noopener noreferrer">${displayName}</a>
            </h3>
            ${previewHTML}
        `;

        container.appendChild(card);
    }
}

renderFiles();



document.addEventListener("DOMContentLoaded", () => {
    const scrollers = document.querySelectorAll(".scroller");

    // If a user hasn't opted in for reduced motion, then we add the animation
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        addAnimation();
    }

    function addAnimation() {
        scrollers.forEach((scroller) => {
            // add data-animated="true" to every `.scroller` on the page
            scroller.setAttribute("data-animated", true);

            // Make an array from the elements within `.scroller-inner`
            const scrollerInner = scroller.querySelector(".scroller__inner");
            const scrollerContent = Array.from(scrollerInner.children);

            // For each item in the array, clone it
            // add aria-hidden to it
            // and add it back to the `.scroller-inner`
            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute("aria-hidden", true);
                scrollerInner.appendChild(duplicatedItem);
            });
        });
    }
});