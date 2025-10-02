# 🎮 Cathedral OS Badge System

This document explains the **retro 16-bit badge system** used across Cathedral OS repositories to create visual continuity between code repos and the HIVE game world.

## 🏷️ Badge Categories

### **Build & Status Badges**
```markdown
![Build](https://img.shields.io/github/actions/workflow/status/USER/REPO/ci.yml?style=for-the-badge&logo=github&label=BUILD)
```
- **Color**: Dynamic (green/red based on build status)
- **Purpose**: Shows if the "civic machinery" is operational
- **Game Parallel**: Server status indicator in game HUD

### **Governance Badges**
```markdown
![PR Size](https://img.shields.io/badge/PR%20Size-Auto--Labeled-8A2BE2?style=for-the-badge&logo=git&logoColor=white)
![Auto Merge](https://img.shields.io/badge/Auto--Merge-Hermes+Zeus-FFD700?style=for-the-badge&logo=githubactions&logoColor=black)
![Safe Merge](https://img.shields.io/badge/Safe--to--Merge-Enabled-32CD32?style=for-the-badge&logo=checkmarx&logoColor=white)
![Governance](https://img.shields.io/badge/Governance-Cathedral%20OS-1E90FF?style=for-the-badge&logo=castle&logoColor=white)
```
- **Colors**: 
  - Purple (`8A2BE2`) = Hermes (Scribe) functions
  - Gold (`FFD700`) = Zeus (Arbiter) functions  
  - Green (`32CD32`) = Safety/approval systems
  - Blue (`1E90FF`) = Cathedral OS branding
- **Game Parallel**: Governance HUD elements, quest approval systems

### **Community Badges**
```markdown
![Citizens](https://img.shields.io/badge/Citizens-Welcome-32CD32?style=for-the-badge&logo=users&logoColor=white)
![Founders](https://img.shields.io/badge/Access-Founders%20Only-FF4500?style=for-the-badge&logo=crown&logoColor=white)
```
- **Purpose**: Shows who can participate
- **Game Parallel**: Player access levels, guild membership

## 🎨 Design Principles

### **Retro Arcade Aesthetic**
- **Style**: `for-the-badge` (chunky, pixelated look)
- **Fonts**: Bold, high-contrast text
- **Colors**: Bright, saturated palette reminiscent of 16-bit games

### **Functional Storytelling**
- Each badge tells part of the governance story
- Colors and icons create visual hierarchy
- Badges work as both technical info AND game world building

### **Cross-Platform Consistency**
- Same badge system across all Cathedral OS repos
- Game UI elements should mirror badge colors/styles
- Artists can use badge palette for in-game governance interfaces

## 🕹️ Game Integration

### **For Game Artists**
Use these colors in your HIVE game UI:
- **Hermes Purple** (`#8A2BE2`): Logging, history, documentation features
- **Zeus Gold** (`#FFD700`): Decision-making, arbitration, merge confirmations  
- **Safety Green** (`#32CD32`): Approved actions, safe zones, completed quests
- **Cathedral Blue** (`#1E90FF`): Main branding, civic features, governance menus

### **For Game Developers**
Map these concepts:
- **PR Size Labels** → Quest difficulty (`XS` = Tutorial, `XL` = Epic Quest)
- **Auto-merge Flow** → Quest completion ceremony
- **Check Status** → Quest validation process
- **Merge Success** → Permanent achievement unlock

### **For UI/UX Designers**
- Badge layout = HUD element positioning
- Color coding = status indication system
- Icon choices = game symbol library
- Typography = pixel font selection

## 📋 Implementation Checklist

When setting up a new Cathedral OS repo:

- [ ] Add build status badge with correct workflow path
- [ ] Include governance badges (PR Size, Auto Merge, Safe Merge)
- [ ] Add Cathedral OS branding badge
- [ ] Include community access badge (Citizens/Founders)
- [ ] Ensure all badges use `for-the-badge` style
- [ ] Test badge links and update repository references
- [ ] Coordinate with game artists on color palette usage

## 🌐 Badge Templates

### **Founder's Core Repository**
```markdown
![Build](https://img.shields.io/github/actions/workflow/status/USER/REPO/ci.yml?style=for-the-badge&logo=github&label=BUILD)
![PR Size](https://img.shields.io/badge/PR%20Size-Auto--Labeled-8A2BE2?style=for-the-badge&logo=git&logoColor=white)
![Auto Merge](https://img.shields.io/badge/Auto--Merge-Hermes+Zeus-FFD700?style=for-the-badge&logo=githubactions&logoColor=black)
![Safe Merge](https://img.shields.io/badge/Safe--to--Merge-Enabled-32CD32?style=for-the-badge&logo=checkmarx&logoColor=white)
![Governance](https://img.shields.io/badge/Governance-Cathedral%20OS-1E90FF?style=for-the-badge&logo=castle&logoColor=white)
```

### **Public Citizen Repository**
```markdown
![Build](https://img.shields.io/github/actions/workflow/status/USER/REPO/ci.yml?style=for-the-badge&logo=github&label=BUILD)
![PR Size](https://img.shields.io/badge/PR%20Size-Hermes%20Labeled-FF69B4?style=for-the-badge&logo=git&logoColor=white)
![Governance](https://img.shields.io/badge/Governance-Civic%20AI-1E90FF?style=for-the-badge&logo=gov&logoColor=white)
![Auto Merge](https://img.shields.io/badge/Auto--Merge-Zeus-FFD700?style=for-the-badge&logo=githubactions&logoColor=black)
![Citizens](https://img.shields.io/badge/Citizens-Welcome-32CD32?style=for-the-badge&logo=users&logoColor=white)
```

---

*This badge system creates visual continuity between the Cathedral OS governance infrastructure and the HIVE 16-bit game world, making the connection between code and gameplay immediately apparent to artists, developers, and players.*
