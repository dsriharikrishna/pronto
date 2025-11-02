// Simple notification sound utility
import { NOTIFICATION_CONFIG, getMinutesUntilBooking } from './notificationConfig.js';

let notificationAudio = null;
let audioContext = null;
let userInteracted = false;

// Initialize audio context (required for user interaction)
const initAudioContext = () => {
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || window.webkitAudioContext)();
      console.log('✅ Audio context initialized');
    } catch (error) {
      console.error('❌ Failed to initialize audio context:', error);
    }
  }
};

// Initialize audio
const initAudio = () => {
  if (!notificationAudio) {
    console.log('🔊 Initializing notification audio...');
    notificationAudio = new Audio('/notification-sound.wav');
    notificationAudio.volume = 1.0; // 100% volume
    notificationAudio.preload = 'auto'; // Preload the audio
    console.log('✅ Audio initialized with volume:', notificationAudio.volume);
  }
};

// Resume audio context (required after user interaction)
const resumeAudioContext = async () => {
  if (audioContext) {
    try {
      if (audioContext.state === 'suspended') {
        console.log('🔄 Audio context is suspended, attempting to resume...');
        await audioContext.resume();
        console.log('✅ Audio context resumed successfully');
      } else {
        console.log('✅ Audio context is already running');
      }
    } catch (error) {
      console.error('❌ Failed to resume audio context:', error);
      return false;
    }
  } else {
    console.log('⚠️ No audio context available, creating new one...');
    initAudioContext();
    return false;
  }
  return true;
};

// Check if booking should trigger notification
const shouldNotify = (booking) => {
  console.log('🔍 Checking booking:', booking?.bookingId, 'Status:', booking?.bookingStatus, 'Scheduled:', booking?.scheduledAt);
  
  if (!booking || !booking.bookingStatus || !booking.scheduledAt) {
    console.log('❌ Booking missing required fields');
    return false;
  }
  
  const matchStatuses = [ 'PENDING_MATCH'];
  const statusMatch = matchStatuses.includes(booking.bookingStatus);
  console.log('📋 Status check:', booking.bookingStatus, 'match statuses:', statusMatch);
  
  if (!statusMatch) {
    console.log('❌ Status does not match any pending match status');
    return false;
  }
  
  // Check if scheduled within configured window (20 minutes)
  const minutesDiff = getMinutesUntilBooking(booking.scheduledAt);
  
  if (minutesDiff === null) {
    console.log('❌ Could not calculate time difference');
    return false;
  }
  
  console.log('⏰ Minutes until booking starts:', minutesDiff);
  
  const timeMatch = minutesDiff < NOTIFICATION_CONFIG.URGENCY_WINDOW_MINUTES;
  console.log(`⏰ Within ${NOTIFICATION_CONFIG.URGENCY_WINDOW_MINUTES} minutes:`, timeMatch);
  
  return timeMatch;
};

// Play notification sound
const playNotification = async () => {
  console.log('🔔 Attempting to play notification sound...');
  
  try {
    // Ensure audio context is available and resumed
    const contextReady = await resumeAudioContext();
    if (!contextReady) {
      console.log('⚠️ Audio context not ready, skipping notification sound');
      return;
    }
    
    // Initialize and play audio
    initAudio();
    
    // Try to play the audio
    await notificationAudio.play();
    console.log('✅ Notification sound played successfully');
  } catch (error) {
    console.error('❌ Failed to play notification sound:', error);
    
    // Fallback: Create a simple beep sound
    if (audioContext && audioContext.state === 'running') {
      try {
        console.log('🔄 Trying fallback beep sound...');
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
        
        console.log('✅ Fallback beep sound played');
      } catch (fallbackError) {
        console.error('❌ Fallback sound also failed:', fallbackError);
      }
    } else {
      console.log('⚠️ Audio context not available for fallback sound');
    }
  }
};

// Main function to check bookings and play sound
export const checkAndNotify = (bookings) => {
  console.log('🚀 checkAndNotify called with bookings:', bookings?.length || 0, 'items');
  
  if (!Array.isArray(bookings)) {
    console.log('❌ Bookings is not an array:', typeof bookings);
    return;
  }
  
  if (bookings.length === 0) {
    console.log('ℹ️ No bookings to check');
    return;
  }
  
  console.log('📊 Checking', bookings.length, 'bookings for notifications...');
  
  let notificationCount = 0;
  bookings.forEach((booking, index) => {
    console.log(`\n--- Booking ${index + 1}/${bookings.length} ---`);
    if (shouldNotify(booking)) {
      notificationCount++;
      console.log('🎯 NOTIFICATION TRIGGERED for booking:', booking.bookingId);
    }
  });
  
  console.log(`\n📈 Summary: ${notificationCount} notification(s) triggered out of ${bookings.length} bookings`);
  
  if (notificationCount > 0) {
    console.log('🔔 Playing notification sound for', notificationCount, 'booking(s)');
    playNotification();
  } else {
    console.log('ℹ️ No notifications to play');
  }
};

// Initialize audio context on user interaction
const initAudioOnUserInteraction = async () => {
  if (!userInteracted) {
    userInteracted = true;
    console.log('👆 User interaction detected, initializing audio context...');
    
    try {
      initAudioContext();
      if (audioContext && audioContext.state === 'suspended') {
        await audioContext.resume();
        console.log('✅ Audio context initialized and resumed successfully');
      } else {
        console.log('✅ Audio context initialized successfully');
      }
    } catch (error) {
      console.error('❌ Failed to initialize audio context on user interaction:', error);
    }
  }
};

// Manual function to initialize audio (can be called from UI)
export const initializeAudio = async () => {
  console.log('🔧 Manual audio initialization requested...');
  await initAudioOnUserInteraction();
  return audioContext && audioContext.state === 'running';
};

// Check if audio is ready
export const isAudioReady = () => {
  return audioContext && audioContext.state === 'running';
};

// Add event listeners for user interaction
if (typeof window !== 'undefined') {
  ['click', 'touchstart', 'keydown', 'mousedown'].forEach(event => {
    document.addEventListener(event, initAudioOnUserInteraction, { once: true });
  });
} 