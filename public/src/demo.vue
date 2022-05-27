<template>
  <VuiFlex
    direction="column"
    class="vui-demo"
  >
    <div class="vui-demo-header vui-flex-row">
      <div class="vui-demo-title">
        Vine UI
      </div>
      <div class="vui-demo-sub">
        Based on <a
          href="https://github.com/vuejs/core"
          target="_blank"
        >Vue 3</a>
      </div>
      <div>
        <a
          href="https://github.com/cenfun/vine-ui"
          target="_blank"
          class="icon-github"
        />
      </div>
    </div>
    <div class="vui-demo-body vui-flex-auto">
      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiButton
        </div>
        <div class="vui-item-example vui-flex-auto vui-flex-row">
          <VuiFlex spacing="5">
            <VuiButton label="Label" />
           
            <VuiButton :label="'Props ' + inputText" />
           
            <VuiButton>
              Slot {{ inputText }}
            </VuiButton>
          
            <VuiButton disabled>
              Disabled
            </VuiButton>
         
            <VuiButton
              primary
              tooltip="This is Button tooltip"
            >
              Button Primary
            </VuiButton>
          </VuiFlex>
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiCheckbox
        </div>
        <div class="vui-item-example vui-flex-auto vui-flex-row">
          <VuiFlex spacing="10">
            <VuiCheckbox>
              Checkbox
            </VuiCheckbox>
         
            <VuiCheckbox checked>
              Checked {{ inputText }}
            </VuiCheckbox>
   
            <VuiCheckbox v-model="checkboxChecked">
              Checkbox v-model
            </VuiCheckbox>

            <VuiCheckbox
              v-model="checkboxChecked"
              disabled
            >
              Disabled {{ checkboxChecked }}
            </VuiCheckbox>
  
            <VuiCheckbox />

            <VuiCheckbox :label="'label '+checkboxChecked" />
          </VuiFlex>
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiFlex
        </div>
        <div class="vui-item-example vui-flex-auto">
          <VuiFlex spacing="10">
            <VuiFlex
              spacing="10"
              direction="column"
            >
              <VuiSelect v-model="flexDirection">
                <option>row</option>
                <option>column</option>
              </VuiSelect>
              <VuiSelect v-model="flexSpacing">
                <option />
                <option>5</option>
                <option>10</option>
                <option>15</option>
                <option>20</option>
              </VuiSelect>
              <VuiSelect v-model="flexWidth">
                <option>100px</option>
                <option>200px</option>
                <option>300px</option>
                <option>30%</option>
              </VuiSelect>
              <VuiSelect v-model="flexHeight">
                <option>100px</option>
                <option>200px</option>
                <option>300px</option>
              </VuiSelect>
            </VuiFlex>

            <VuiFlex
              :direction="flexDirection"
              :spacing="flexSpacing"
              :width="flexWidth"
              :height="flexHeight"
              style="background: #ccc;"
            >
              <VuiButton>Button</VuiButton>
              <span>span</span>
              <button>Button</button>
              <div>div</div>
            </VuiFlex>

            <VuiFlex
              :direction="flexDirection"
              :spacing="flexSpacing"
              :width="flexWidth"
              :height="flexHeight"
              style="background: #ccc;"
            >
              <VuiButton>Button</VuiButton>
              <div
                class="vui-flex-auto"
                style="background: #eee;"
              >
                <span>auto</span>
                <button>Button</button>
              </div>
              <div>div</div>
            </VuiFlex>

            <VuiFlex
              :direction="flexDirection"
              :spacing="flexSpacing"
              :width="flexWidth"
              :height="flexHeight"
              style="background: #ccc;"
            >
              <VuiButton>Button</VuiButton>
              <span>span</span>
              <div
                class="vui-flex-empty"
                style="background: #eee;"
              >
                empty
              </div>
              <button>Button</button>
              <div>div</div>
            </VuiFlex>
          </VuiFlex>
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiFlyover
        </div>
        <div class="vui-item-example vui-flex-auto vui-flex-row">
          <VuiFlex spacing="10">
            <VuiSelect
              v-model="flyoverWidth"
              label="width:"
            >
              <option>30%</option>
              <option>50%</option>
              <option>60%</option>
              <option>100px</option>
            </VuiSelect>
         
            <VuiSelect
              v-model="flyoverPosition"
              label="position:"
            >
              <option>right</option>
              <option>left</option>
            </VuiSelect>

            <VuiButton @click.native="flyoverVisible=!flyoverVisible">
              Toggle
            </VuiButton>

            <VuiButton @click.native="flyoverVisible=true">
              Show
            </VuiButton>

            <VuiButton @click.native="flyoverVisible=false">
              Hide
            </VuiButton>
          </VuiFlex>
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiInput
        </div>
        <div class="vui-item-example vui-flex-auto vui-flex-row">
          <VuiFlex spacing="10">
            <VuiInput
              v-model="inputText"
              label="Name:"
            />
            
            <VuiInput
              v-model="inputText"
              placeholder="no label placeholder"
              width="150px"
            />
            
            <VuiInput disabled>
              Disabled {{ inputText }}:
            </VuiInput>
            
            <VuiInput
              type="number"
              step="10"
            >
              Number:
            </VuiInput>
            
            <VuiInput
              :label="inputText"
              placeholder="props"
            />
          </VuiFlex>
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiLoading
        </div>
        <div class="vui-item-example vui-flex-auto">
          <VuiFlex spacing="10">
            <VuiSelect
              v-model="loadingColor"
              label="Color"
            >
              <option />
              <option>red</option>
              <option>green</option>
              <option>#666</option>
            </VuiSelect>
            <VuiSelect
              v-model="loadingSize"
              label="Size"
            >
              <option />
              <option>s</option>
              <option>m</option>
              <option>l</option>
            </VuiSelect>
            <VuiCheckbox v-model="loadingFast">
              Fast
            </VuiCheckbox>
            <VuiCheckbox v-model="loadingCenter">
              Center
            </VuiCheckbox>
            <VuiCheckbox v-model="loadingVisible">
              Visible
            </VuiCheckbox>
          </VuiFlex>
          <div style="height: 80px; position: relative; border: 1px solid #eee; margin-top: 5px;">
            <VuiLoading
              :size="loadingSize"
              :color="loadingColor"
              :fast="loadingFast"
              :center="loadingCenter"
              :visible="loadingVisible"
            />
          </div>
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiModal
        </div>
        <div class="vui-item-example vui-flex-auto vui-flex-row">
          <VuiButton @click.native="openModal">
            Open Modal
          </VuiButton>
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiPopover
        </div>
        <div class="vui-item-example vui-flex-auto vui-popover-example">
          <VuiFlex spacing="20">
            <VuiButton @click.native="openPopover">
              Open Popover
            </VuiButton>
            <VuiButton @click.native="openPopover">
              Open Popover
            </VuiButton>
            <div class="vui-flex-empty" />
            <VuiButton @click.native="openPopover">
              Open Popover
            </VuiButton>
            <VuiButton @click.native="openPopover">
              Open Popover
            </VuiButton>
          </VuiFlex>

          <div style="background: #f5f5f5; margin-top: 10px;">
            <div class="vui-popup-arrow-example" />
          </div>

          <div style="position: relative; width: 520px; height: 360px; border: 1px solid #ccc; margin-top: 10px;">
            <VuiPopover
              :attach-to-body="false"
              :auto-close="false"
              :bind-resize="false"
              :bind-scroll="false"
              positions="bottom-right"
              :target="{left:20,top:10}"
              :width="100"
            >
              bottom-right {{ inputText }}
            </VuiPopover>
            <VuiPopover
              :attach-to-body="false"
              :auto-close="false"
              :bind-resize="false"
              :bind-scroll="false"
              positions="bottom-center"
              :target="{left:260,top:10}"
              :width="100"
            >
              bottom-center
            </VuiPopover>
            <VuiPopover
              :attach-to-body="false"
              :auto-close="false"
              :bind-resize="false"
              :bind-scroll="false"
              positions="bottom-left"
              :target="{left:500,top:10}"
              :width="100"
            >
              bottom-left
            </VuiPopover>

            <VuiPopover
              :attach-to-body="false"
              :auto-close="false"
              :bind-resize="false"
              :bind-scroll="false"
              positions="left-bottom"
              :target="{left:510,top:90}"
              :width="100"
            >
              left-bottom
            </VuiPopover>

            <VuiPopover
              :attach-to-body="false"
              :auto-close="false"
              :bind-resize="false"
              :bind-scroll="false"
              positions="left-center"
              :target="{left:510,top:180}"
              :width="100"
            >
              left-center
            </VuiPopover>

            <VuiPopover
              :attach-to-body="false"
              :auto-close="false"
              :bind-resize="false"
              :bind-scroll="false"
              positions="left-top"
              :target="{left:510,top:270}"
              :width="100"
            >
              left-top
            </VuiPopover>

            <VuiPopover
              :attach-to-body="false"
              :auto-close="false"
              :bind-resize="false"
              :bind-scroll="false"
              positions="top-left"
              :target="{left:500,top:350}"
              :width="100"
            >
              top-left
            </VuiPopover>

            <VuiPopover
              :attach-to-body="false"
              :auto-close="false"
              :bind-resize="false"
              :bind-scroll="false"
              positions="top-center"
              :target="{left:260,top:350}"
              :width="100"
            >
              top-center
            </VuiPopover>

            <VuiPopover
              :attach-to-body="false"
              :auto-close="false"
              :bind-resize="false"
              :bind-scroll="false"
              positions="top-right"
              :target="{left:20,top:350}"
              :width="100"
            >
              top-right
            </VuiPopover>

            <VuiPopover
              :attach-to-body="false"
              :auto-close="false"
              :bind-resize="false"
              :bind-scroll="false"
              positions="right-top"
              :target="{left:10,top:270}"
              :width="100"
            >
              right-top
            </VuiPopover>

            <VuiPopover
              :attach-to-body="false"
              :auto-close="false"
              :bind-resize="false"
              :bind-scroll="false"
              positions="right-center"
              :target="{left:10,top:180}"
              :width="100"
            >
              right-center
            </VuiPopover>

            <VuiPopover
              :attach-to-body="false"
              :auto-close="false"
              :bind-resize="false"
              :bind-scroll="false"
              positions="right-bottom"
              :target="{left:10,top:90}"
              :width="100"
            >
              right-bottom
            </VuiPopover>
          </div>
        </div>
      </div>
      

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiRadio
        </div>
        <div class="vui-item-example vui-flex-auto vui-flex-row">
          <VuiFlex spacing="10">
            <VuiRadio
              v-model="radioValue"
              name="radioName"
              value="1"
            >
              Radio 1
            </VuiRadio>
           
            <VuiRadio
              v-model="radioValue"
              name="radioName"
              value="2"
            >
              Radio 2 {{ inputText }}
            </VuiRadio>
           
            <VuiRadio
              checked
              name="radioDisabledName"
              value="3"
            />
           
            <VuiRadio
              v-model="radioValue"
              disabled
              name="radioDisabledName"
              value="1"
            >
              Disabled {{ radioValue }}
            </VuiRadio>
           
            <VuiRadio
              v-model="radioValue"
              checked
              disabled
              name="radioDisabledName"
              value="2"
              :label="'Props ' + radioValue"
            />
          </VuiFlex>
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiSelect
        </div>
        <div class="vui-item-example vui-flex-auto">
          <VuiFlex spacing="15">
            <VuiSelect
              v-model="selectValue"
              label="My List:"
              :options="selectOptions"
            />

            <VuiSelect label="selected:">
              <option>option 1</option>
              <option>option 2</option>
              <option>option 3</option>
              <option selected>
                One
              </option>
              <option>Two</option>
            </VuiSelect>

            <VuiSelect
              v-model="selectValue"
              disabled
              label="Disabled:"
            >
              <option>option 1</option>
              <option>option 2</option>
              <option>option 3</option>
            </VuiSelect>
          </VuiFlex>

          <VuiFlex
            spacing="10"
            style="margin-top: 10px;"
          >
            <VuiSelect
              v-model="selectValue"
              label="Select:"
              :options="selectList"
            />
            <VuiSelect
              v-model="selectValue"
              label="200 width:"
              width="200"
              :options="selectList"
            />
            <VuiSelect
              v-model="selectValue"
              label="Disabled:"
              :options="selectList"
              disabled
            />
            <div class="vui-flex-empty" />
            <VuiSelect
              v-model="selectValue"
              label="Input:"
              :options="selectResults"
              :searchable="true"
              @search="onSelectSearch"
              @remove="onSelectRemove"
            />
            <VuiSelect
              v-model="selectValue"
              label="100 width:"
              width="100"
              :options="selectResults"
              :searchable="true"
              @remove="onSelectRemove"
            />
          </VuiFlex>

          <VuiFlex
            spacing="10"
            style="margin-top: 10px;"
          >
            <VuiSelect
              v-model="selectValue"
              label="Slot Options:"
            >
              <option />
              <option>5</option>
              <option>10</option>
              <option>15</option>
              <option>20</option>
            </VuiSelect>

            <VuiSelect
              v-model="selectValue"
              label="Slot Options:"
            >
              <option />
              <option>dddddddddd ddddddddddddddddd ddddddddddddd5</option>
              <option>10ddddd ddddddddddd</option>
              <option>15ddddddddddddddddddddddddddddddddddddddddddddddddddddddddddddd</option>
              <option>20ddddddd ddddddddddd</option>
            </VuiSelect>
          </VuiFlex>
        </div>
      </div>
      

      <div class="vui-item vui-flex-row">
        <div class="vui-item-name">
          VuiTab
        </div>
        <div class="vui-item-example vui-flex-auto">
          <VuiTab
            v-model="tabActive"
            position="left"
          >
            <template #toolbar>
              <div class="vui-flex-auto" />
              <div
                class="vui-tab-icon vui-tab-icon-plus"
                tooltip="This is toolbar tooltip"
              >
                Left Toolbar Slot {{ inputText }}
              </div>
            </template>
            <template #tabs>
              <div>
                Tab 1 {{ inputText }}
              </div>
              <div>Tab 2</div>
            
              <div
                class="vui-tab-icon vui-tab-icon-tools"
                tooltip="This is tab tooltip"
              >
                Tab 3
              </div>

              <div>
                Tab 4 Max Width Long Text Long Text Long Text
              </div>
              <div>Tab 5</div>
              <span />
            </template>
            <template #panes>
              <div>Pane 1 </div>
              <div>Pane 2 {{ inputText }}</div>
              <div>Pane 3</div>
              <VuiButton>
                Button Pane 4
              </VuiButton>
              <div>Pane 5</div>
              <span />
            </template>
          </VuiTab>
          <div class="vui-vs-10" />
          <VuiTab
            v-model="tabActive"
            position="right"
            :toolbar="'Right Toolbar Props ' + inputText"
            :tabs="['Tab 1', 'Tab 2', 'Tab 3']"
            :panes="tabPanes"
          />
        </div>
      </div>

      <div class="vui-item vui-flex-row">
        <div
          class="vui-item-name"
          tooltip="This is VuiTooltip left This is VuiTooltip left"
        >
          VuiTooltip
        </div>
        <div class="vui-item-example vui-flex-auto">
          <VuiFlex spacing="20">
            <VuiButton tooltip="This is VuiTooltip left This is VuiTooltip left">
              Hover Tooltip
            </VuiButton>
           
            <div class="vui-flex-auto">
              <VuiButton tooltip="This is VuiTooltip left">
                Hover Tooltip
              </VuiButton>
              <VuiButton tooltip="This is VuiTooltip center">
                Hover Tooltip
              </VuiButton>
            </div>

            <VuiButton tooltip="This is VuiTooltip center">
              Hover Tooltip
            </VuiButton>
            <VuiButton tooltip="This is VuiTooltip right">
              Hover Tooltip
            </VuiButton>
          </VuiFlex>
        </div>
      </div>
    </div>
    <VuiFlyover
      ref="flyover"
      :visible="flyoverVisible"
      :position="flyoverPosition"
      :width="flyoverWidth"
    >
      <div style="padding: 10px;">
        This is flyover container
        <VuiButton @click.native="flyoverVisible=false">
          close
        </VuiButton>
        {{ inputText }}
      </div>
    </VuiFlyover>
  </VuiFlex>
</template>
<script>
/* eslint-disable chain/dependencies */
import { components, createComponent } from 'vine-ui';
/* eslint-enable */

console.log('components', components);

const {
    VuiButton,
    VuiCheckbox,
    VuiFlex,
    VuiFlyover,
    VuiInput,
    VuiLoading,
    VuiModal,
    VuiPopover,
    VuiRadio,
    VuiSelect,
    VuiTab,
    VuiTooltip
} = components;

const Demo = {

    createComponent,
    
    components: {
        VuiButton,
        VuiCheckbox,
        VuiFlex,
        VuiFlyover,
        VuiInput,
        VuiLoading,
        VuiModal,
        VuiPopover,
        VuiRadio,
        VuiSelect,
        VuiTab,
        VuiTooltip
    },
    
    data() {
        return {
            inputText: '',
            checkboxChecked: true,
            radioValue: '',
            flyoverVisible: false,
            flyoverPosition: 'right',
            flyoverWidth: '30%',
            tabActive: 1,
            tabPanes: ['Pane 1', 'Pane 2', function(h) {
                return h(VuiButton, {
                    label: 'Label'
                });
            }],
            flexDirection: 'column',
            flexSpacing: '5',
            flexWidth: '300px',
            flexHeight: '200px',
            loadingColor: '',
            loadingSize: 'l',
            loadingFast: false,
            loadingCenter: true,
            loadingVisible: true,
            selectValue: 'STG',
            selectOptions: [{
                label: 'One'
            }, {
                label: 'Two'
            }, {
                label: 'Three'
            }],
            selectList: [
                '',
                'DEV',
                'QA',
                'STG',
                'LOCAL'
            ],
            selectResults: [
                '',
                'Short',
                'Long Long Long Long Long Long Long Long Long Long Long Long Long Long Long',
                "I'm a really long string that I'm going to use to test the ellipsis functionality",
                'QA'
            ]
        };
    },

    mounted() {
        this.initTooltip();
    },

    methods: {

        onSelectSearch(e) {

            //console.log(e);
            const value = e.target.value;

            const len = Math.ceil(30 * Math.random());
            const results = [];
            let i = 0;
            while (i < len) {
                const ls = [value];
                ls.length = Math.ceil(12 * Math.random());
                const str = ls.join(' Text');
                results.push({
                    label: `${i + 1}, ${str}`,
                    removable: true
                });
                i++;
            }
            this.selectResults = results;

            //console.log(v);
        },

        onSelectRemove(item, e) {
            console.log('onSelectRemove', item, e);
        },

        openModal() {
            VuiModal.createComponent({
                title: 'Modal Title'
            }, (h) => {
                return {
                    default: () => {
                        return [h(VuiCheckbox, {
                            label: 'Modal Checkbox'
                        }), h(VuiButton, {
                            label: 'Modal Button'
                        })];
                    }
                };
            });
        },

        openPopover: function(e) {
            VuiPopover.createComponent({
                target: e.target,
                title: 'Popover Title'
            }, (h) => {
                return {
                    default: () => {
                        return [h(VuiCheckbox, {
                            label: 'Popover Checkbox 1'
                        }), h(VuiCheckbox, {
                            label: 'Popover Checkbox 2'
                        }), h(VuiCheckbox, {
                            label: 'Popover Checkbox 3'
                        })];
                    }
                };
            });
        },

        initTooltip() {
            setTimeout(() => {
                const tooltips = Array.from(document.querySelectorAll('[tooltip]'));
                tooltips.forEach((item) => {
                    item.addEventListener('click', () => {
                        this.pinTooltip(item);
                    });
                    item.addEventListener('mouseenter', () => {
                        this.showTooltip(item);
                    });
                    item.addEventListener('mouseleave', () => {
                        this.hideTooltip(item);
                    });
                });
            }, 100);
        },

        showTooltip: function(elem) {
            this.hideTooltip(elem);
            if (elem.$tooltip) {
                return;
            }
            elem.$tooltip = VuiTooltip.createComponent({
                target: elem,
                text: elem.getAttribute('tooltip')
            });
        },

        hideTooltip: function(elem) {
            if (!elem.$tooltip) {
                return;
            }
            if (elem.$tooltip.disabled) {
                return;
            }
            elem.$tooltip.unmount();
            elem.$tooltip = null;
        },

        pinTooltip: function(elem) {
            if (!elem.$tooltip || elem.nodeName !== 'BUTTON') {
                return;
            }
            elem.$tooltip.disabled = !elem.$tooltip.disabled;
        }
    }
};

export default Demo;
</script>
<style lang="scss">
html,
body {
    margin: 0;
    padding: 0;
    width: 100%;
    height: 100%;
    font-family: Helvetica, Arial, sans-serif;
    font-size: 14px;
    color: #333;
}

.vui-demo {
    width: 100%;
    height: 100%;
    position: relative;
}

.vui-demo-header {
    padding: 5px 10px;
    background: #f5f5f5;
    border-bottom: 1px solid #ccc;
    box-sizing: border-box;
}

.vui-demo-title {
    height: 30px;
    line-height: 30px;
    font-size: 16px;
    font-weight: bold;
}

.vui-demo-sub {
    padding-left: 10px;
    color: #666;
    height: 30px;
    line-height: 30px;
    flex: 1;
}

.icon-github {
    display: block;
    margin-right: 5px;
    width: 26px;
    height: 26px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: 26px 26px;
    background-image: url("images/github.svg");
    opacity: 0.6;
}

.icon-github:hover {
    opacity: 1;
}

.vui-demo-body {
    overflow-y: auto;
    padding: 10px;
}

.vui-item {
    border-bottom: 1px dotted #ccc;
    padding: 5px;
}

.vui-item-name {
    width: 90px;
    padding: 5px 5px 5px 0;
    overflow: hidden;
    color: #000;
}

.vui-item-example {
    border-left: 1px solid #ccc;
    padding: 5px 5px 5px 10px;
}

.vui-popover-example .vui-popover-content {
    text-align: center;
}

.vui-popup-arrow-example {
    height: 54px;
    background-repeat: no-repeat;
    background-image: url("../../src/base/images/popup-arrow.svg");
    background-size: 54px 54px;
}

.vui-tab-icon {
    padding-left: 25px;
    background-repeat: no-repeat;
    background-position: 2px center;
    background-size: 18px 18px;
    padding-right: 8px;
}

.vui-tab-icon-tools {
    background-image: url("images/tools.svg");
}

.vui-tab-icon-plus {
    background-image: url("images/plus.svg");
}

</style>
